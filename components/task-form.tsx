"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CREATE_TASK, UPDATE_TASK } from "@/graphql/mutations.graphql";
import { GET_TASKS, GET_USERS } from "@/graphql/queries.graphql";
import {
  Mutation,
  PointEstimate,
  Status,
  Task,
  TaskTag,
  User,
} from "@/graphql/types";
import { cn } from "@/lib/utils";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Edit2Icon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar } from "./ui/calendar";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { toast } from "./ui/use-toast";
import { useState } from "react";

const TaskFormSchema = z.object({
  name: z.string().min(1, {
    message: "Task name must be at least 1 characters.",
  }),
  pointEstimate: z.string(),
  dueDate: z.date(),
  tags: z.array(z.string()),
  assigneeId: z.string().optional(),
  id: z.string().optional(),
  status: z.string().optional(),
});

export const TaskForm = ({
  variant,
}: {
  variant: { type: "CREATE" } | { type: "UPDATE"; value: Task };
}) => {
  const [open, setOpen] = useState(false);

  const [mutate] = useMutation<Mutation>(
    variant.type === "CREATE" ? CREATE_TASK : UPDATE_TASK,
    variant.type === "CREATE"
      ? {
          update(cache, { data }) {
            if (!data) {
              return;
            }

            const existingTasks: { tasks: Task[] } = cache.readQuery({
              query: GET_TASKS,
              variables: { input: {} },
            }) ?? { tasks: [] };
            const update = [...existingTasks.tasks, { ...data.createTask }];

            cache.writeQuery({
              query: GET_TASKS,
              data: {
                tasks: update,
              },
              variables: {
                input: {},
              },
            });
          },
          onCompleted: () => {
            toast({
              title: "Task created",
            });
          },
        }
      : {
          onCompleted: () => {
            toast({
              title: "Task updated",
            });
          },
        },
  );

  const { data: users } = useSuspenseQuery<{ users: User[] }>(GET_USERS);

  const form = useForm<z.infer<typeof TaskFormSchema>>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues:
      variant.type === "UPDATE"
        ? {
            tags: variant.value.tags ?? [],
            name: variant.value.name,
            assigneeId: variant.value.assignee?.id,
            pointEstimate: variant.value.pointEstimate,
            id: variant.value.id,
            dueDate: new Date(variant.value.dueDate),
          }
        : {
            tags: [],
            status: Status.Backlog,
            name: "New Task",
            assigneeId: undefined,
            dueDate: undefined,
            pointEstimate: undefined,
          },
  });

  function onSubmit(data: z.infer<typeof TaskFormSchema>) {
    mutate({
      variables: {
        input: {
          ...data,
        },
      },
    });

    if (variant.type === "CREATE") {
      form.reset();
    }

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} data-no-dnd="true">
      <DialogTrigger asChild className="z-50">
        {variant.type === "CREATE" ? (
          <div className="bg-primary text-primary-foreground hover:bg-primary/90 flex justify-center p-2 rounded-[10px]">
            <PlusIcon />
          </div>
        ) : (
          <div className="z-50 select-none bg-background p-2 px-4 w-full flex items-center gap-2">
            <Edit2Icon size={15} /> Edit
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl z-50" data-no-dnd="true">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} data-no-dnd="true">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input placeholder="Task Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col md:flex-row w-full justify-between pt-4">
              <FormField
                control={form.control}
                name="pointEstimate"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-600/50 rounded-[15px] flex min-w-36">
                          <SelectValue placeholder="Estimate" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(PointEstimate).map((e) => (
                          <SelectItem value={e} key={e}>
                            {e}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-600/50 rounded-[15px] flex min-w-36">
                          {variant.type === "UPDATE" ? (
                            <SelectValue
                              defaultValue={variant.value.assignee?.fullName}
                            />
                          ) : (
                            <SelectValue placeholder="Assignee" />
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.users.map((e) => (
                          <SelectItem value={e.id} key={e.id}>
                            {e.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={() => (
                  <FormItem>
                    <Popover data-no-dnd="true">
                      <PopoverTrigger className="flex justify-start text-sm pl-4 items-center py-[10px] bg-gray-600/50 min-w-36 rounded-[15px]" data-no-dnd="true">
                        Label
                      </PopoverTrigger>
                      <PopoverContent data-no-dnd="true">
                        {Object.values(TaskTag).map((item) => (
                          <FormField
                            key={item}
                            control={form.control}
                            name="tags"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              item,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item,
                                              ),
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {item}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                data-no-dnd="true"
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col" data-no-dnd="true" >
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal  bg-gray-600/50 ",
                              !field.value,
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start" data-no-dnd="true">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          data-no-dnd="true"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex float-right pt-4 gap-5">
              <DialogClose asChild>
                <Button size={"sm"} type="button" variant={"outline"}>
                  Cancel
                </Button>
              </DialogClose>
              <Button size="sm" type="submit">
                {(variant.type === "CREATE" ?? "Create", "Update")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
