"use client";

import { BucketColumn } from "@/components/bucket";
import { Droppable } from "@/components/droppable";
import { SideNavigation } from "@/components/side-navigation";
import { TopSearch } from "@/components/top-search";
import { toast } from "@/components/ui/use-toast";
import { UPDATE_TASK } from "@/graphql/mutations.graphql";
import { GET_TASKS } from "@/graphql/queries.graphql";
import { FilterTaskInput, Status, Task, TaskTag } from "@/graphql/types";
import { useMutation, useQuery } from "@apollo/client";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import { z } from "zod";

const UpdateTaskStatusSchema = z.object({
  id: z.string(),
  status: z.string(),
});

export default function Home() {
  const { data, refetch, loading } = useQuery<{ tasks: Task[] }>(GET_TASKS, {
    variables: {
      input: {},
    },
  });

  const [estimateFilter, setEstimateFilter] = useState<string>("");
  const [tagFilter, setTagFilter] = useState<TaskTag[]>([]);

  const mouseSensor = useSensor(MouseSensor, {
    // Press delay of 200ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 100,
      tolerance: 10,
    },
  });

  const pointerSensor = useSensor(PointerSensor, {
    // Press delay of 200ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 100,
      tolerance: 10,
    },
  });

  const sensors = useSensors(mouseSensor, pointerSensor);

  const [mutate] = useMutation(UPDATE_TASK, {
    onCompleted: () => {
      toast({ title: "Task updated" });
    },
  });

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
    <main className="flex max-h-screen flex-row justify-start gap-10 p-7 min-h-screen">
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

        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
          <div className="flex flex-row gap-5 flex-1 w-full h-full overflow-y-auto ">
            {columns.map((column) => (
              <Droppable
                key={column.status}
                id={column.status}
                status={column.status}
              >
                <BucketColumn
                  isLoading={loading}
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
