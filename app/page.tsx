"use client";

export const dynamic = "force-dynamic";

import { BucketColumn } from "@/components/bucket-column";
import { Droppable } from "@/components/droppable";
import { SideNavigation } from "@/components/side-navigation";
import { TopSearch } from "@/components/top-search";
import { toast } from "@/components/ui/use-toast";
import { UPDATE_TASK } from "@/graphql/mutations.graphql";
import { GET_TASKS } from "@/graphql/queries.graphql";
import {
  FilterTaskInput,
  MutationUpdateTaskArgs,
  Status,
  Task,
  TaskTag,
} from "@/graphql/types";
import { useMutation, useQuery } from "@apollo/client";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";
import { z } from "zod";

const UpdateTaskStatusSchema = z.object({
  id: z.string(),
  status: z.string(),
});

export default function Home() {
  const { data, refetch } = useQuery<{ tasks: Task[] }>(GET_TASKS, {
    variables: {
      input: {},
    },
  });

  const [estimateFilter, setEstimateFilter] = useState<string>("");
  const [tagFilter, setTagFilter] = useState<TaskTag[]>([]);

  const [mutate, { loading, error }] =
    useMutation<MutationUpdateTaskArgs>(UPDATE_TASK);

  // Array of objects containing header and corresponding status
  const columns = [
    { header: "Backlog", status: Status.Backlog },
    { header: "To Do", status: Status.Todo },
    { header: "In Progress", status: Status.InProgress },
    { header: "Done", status: Status.Done },
    { header: "Cancelled", status: Status.Cancelled },
  ];

  // Function to filter tasks by status
  const filterTasksByStatus = (status: Status) =>
    data?.tasks.filter((task) => task.status === status) ?? [];

  function onSubmit(data: z.infer<typeof UpdateTaskStatusSchema>) {
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

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;
    const id = active?.data?.current?.id;
    const status = over?.data.current?.status;

    if (!id || !status) {
      return;
    }

    onSubmit({ id, status });
  }

  return (
    <main className="flex max-h-screen flex-row justify-start gap-10 p-7">
      <SideNavigation />
      <div className="flex flex-col w-full  overflow-x-auto">
        <TopSearch
          onSetNameFilter={(name: string) => {
            const filterInput: FilterTaskInput = name === "" ? {} : { name };
            refetch({ input: filterInput });
          }}
          updateEstimateFilter={(estimate) => {
            if (estimate === estimateFilter) {
              refetch({ input: {} });
              setEstimateFilter("");
            } else {
              const filterInput: FilterTaskInput = { pointEstimate: estimate };
              refetch({ input: filterInput });
              setEstimateFilter(estimate);
            }
          }}
          udpateTagFilter={(tags) => {
            const filterInput: FilterTaskInput = { tags };
            refetch({ input: filterInput });
            setTagFilter(tags);
          }}
          estimateFilter={estimateFilter}
          tagFilter={tagFilter}
        />

        <DndContext onDragEnd={handleDragEnd}>
          <div className="flex flex-row gap-5 flex-1 w-full h-full overflow-y-auto ">
            {columns.map((column) => (
              <Droppable
                key={column.status}
                id={column.status}
                status={column.status}
              >
                <BucketColumn
                  key={column.header}
                  header={column.header}
                  tasks={filterTasksByStatus(column.status)}
                />
              </Droppable>
            ))}
          </div>
        </DndContext>
      </div>
    </main>
  );
}
