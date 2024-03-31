"use client";

import { DELETE_TASK } from "@/graphql/mutations.graphql";
import { DeleteTaskInput, Mutation, Task } from "@/graphql/types";
import { useMutation } from "@apollo/client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { GET_TASKS } from "@/graphql/queries.graphql";
import { Trash2Icon } from "lucide-react";
import { toast } from "./ui/use-toast";

export function TaskDelete({ taskId }: { taskId: string }) {
  const [mutate] = useMutation<Mutation>(DELETE_TASK, {
    update(cache, { data }) {
      const existingTasks: { tasks: Task[] } = cache.readQuery({
        query: GET_TASKS,
        variables: { input: {} },
      }) ?? { tasks: [] };
      const updateTaks = existingTasks.tasks.filter(
        (task) => task.id !== data?.deleteTask.id,
      );

      cache.writeQuery({
        query: GET_TASKS,
        data: {
          tasks: updateTaks,
        },
        variables: {
          input: {},
        },
      });
    },
    onCompleted: () => {
      toast({
        title: "Task deleted",
      });
    },
  });

  const handleOnClickDelete = () => {
    mutate({ variables: { input: { id: taskId } as DeleteTaskInput } });
  };

  return (
    <AlertDialog data-no-dnd="true">
      <AlertDialogTrigger asChild>
        <div className="select-none bg-background p-2 px-4 w-full flex items-center gap-2 mt-1 " data-no-dnd="true" >
          <Trash2Icon size={15} />
          Delete
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent data-no-dnd="true">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this task
            and remove your task data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleOnClickDelete}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
