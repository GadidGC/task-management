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
  MutationCreateTaskArgs,
  MutationUpdateTaskArgs,
  PointEstimate,
  Status,
  Task,
  TaskTag,
  User,
} from "@/generated/graphql";
import { CREATE_TASK, UPDATE_TASK } from "@/graphql/mutations.graphql";
import { GET_USERS } from "@/graphql/queries.graphql";
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

const DotsIcon = () => (
  <svg
    fill="#ffffff"
    height="16px"
    width="16px"
    version="1.1"
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32.055 32.055"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <g>
        <path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967 C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967 s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967 c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"></path>{" "}
      </g>
    </g>
  </svg>
);

const UpdateTaskInputSchema = z.object({
  name: z.string().min(1, {
    message: "Task name must be at least 1 characters.",
  }),
  pointEstimate: z.string(),
  dueDate: z.date().optional(),
  tags: z.array(z.string()),
  assigneeId: z.string().optional(),
  id: z.string(),
});

export const TaskUpdateForm = ({ task }: { task: Task }) => {
  const [updateTask, { loading, error }] =
    useMutation<MutationUpdateTaskArgs>(UPDATE_TASK);

  const { data: users } = useSuspenseQuery<{ users: User[] }>(GET_USERS);

  const form = useForm<z.infer<typeof UpdateTaskInputSchema>>({
    resolver: zodResolver(UpdateTaskInputSchema),
    defaultValues: {
      tags: task.tags ?? [],
      name: task.name,
      assigneeId: task.assignee?.id,
      pointEstimate: task.pointEstimate,
      id: task.id,
    },
  });

  function onSubmit(data: z.infer<typeof UpdateTaskInputSchema>) {
    updateTask({
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
      <DialogTrigger asChild>
        <div className="flex relative hover:bg-primary/20 text-white p-3 rounded-full">
          <DotsIcon />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
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
                          <SelectValue defaultValue={task.assignee?.fullName} />
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
                        ))}{" "}
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
                Update
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const CreateTaskInputSchema = z.object({
  name: z.string().min(1, {
    message: "Task name must be at least 1 characters.",
  }),
  pointEstimate: z.string(),
  dueDate: z.date(),
  tags: z.array(z.string()),
  assigneeId: z.string().optional(),
  status: z.string(),
});

export const CreateTaskForm = () => {
  const [updateTask, { loading, error }] =
    useMutation<MutationCreateTaskArgs>(CREATE_TASK);

  const { data: users } = useSuspenseQuery<{ users: User[] }>(GET_USERS);

  const form = useForm<z.infer<typeof CreateTaskInputSchema>>({
    resolver: zodResolver(CreateTaskInputSchema),
    defaultValues: {
      tags: [],
      status: Status.Backlog,
    },
  });

  function onSubmit(data: z.infer<typeof CreateTaskInputSchema>) {
    updateTask({
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
      <DialogTrigger asChild>
        <div className="flex relative hover:bg-primary/20 text-white p-3 rounded-full">
          <PlusIcon />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
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
                          <SelectValue />
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
                        ))}{" "}
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
                Update
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
