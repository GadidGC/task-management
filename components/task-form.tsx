"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import {
  Mutation,
  MutationCreateTaskArgs,
  MutationUpdateTaskArgs,
  PointEstimate,
  Status,
  Task,
  TaskTag,
  User,
} from "@/graphql/types";
import { CREATE_TASK, UPDATE_TASK } from "@/graphql/mutations.graphql";
import { GET_TASKS, GET_USERS } from "@/graphql/queries.graphql";
import { cn } from "@/lib/utils";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar } from "./ui/calendar";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { toast } from "./ui/use-toast";
import { DotsIcon } from "./icons";

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
  const [mutate, { loading, error }] = useMutation<Mutation>(
    variant.type === "CREATE" ? CREATE_TASK : UPDATE_TASK, variant.type === "CREATE" ? {
      update(cache, { data }) {
        if (!data) { return }

        const existingTasks: { tasks: Task[] } = cache.readQuery({ query: GET_TASKS, variables: { input: {} } }) ?? { tasks: [] };
        const update = [...existingTasks.tasks, { ...data.createTask }];

        cache.writeQuery({
          query: GET_TASKS,
          data: {
            tasks: update,
          },
          variables: {
            input: {}
          }
        });
      }
    } : undefined
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
        : { tags: [], status: Status.Backlog },
  });

  function onSubmit(data: z.infer<typeof TaskFormSchema>) {
    mutate({
      variables: {
        input: {
          ...data,
        },
      },
    });
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild className="z-50">
        {variant.type === "CREATE" ? (
          <div className="bg-primary text-primary-foreground hover:bg-primary/90 flex justify-center p-2 rounded-[10px]">
            <PlusIcon />
          </div>
        ) : (
          <div className="z-50 select-none">Edit</div>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl z-50">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row w-full justify-between pt-4">
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
                        <SelectTrigger>
                          <SelectValue />
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
                        <SelectTrigger>
                          {variant.type === "UPDATE" ? (
                            <SelectValue
                              defaultValue={variant.value.assignee?.fullName}
                            />
                          ) : (
                            <SelectValue />
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
                    <Popover>
                      <PopoverTrigger className="">
                        <div>Open v</div>
                      </PopoverTrigger>
                      <PopoverContent>
                        {Object.values(TaskTag).map((item) => (
                          < FormField
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
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
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
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex float-right pt-4 gap-5">
              <Button size={"sm"} type="button">
                Cancel
              </Button>

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
