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
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import { z } from "zod";
import { MouseSensor as LibMouseSensor, TouchSensor as LibTouchSensor } from '@dnd-kit/core';
import { MouseEvent, TouchEvent } from 'react';

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

  const mouseSensor = useSensor(MouseSensor);

  const touchSensor = useSensor(TouchSensor);

  const sensors = useSensors(mouseSensor, touchSensor);

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
    <main className="flex max-h-screen flex-col md:flex-row justify-start gap-10 p-7 min-h-screen  overflow-x-auto" style={{overflowX: "auto"}}>
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
          <div className="flex flex-col md:flex-row gap-5 flex-1 w-full h-full overflow-y-scroll md:overflow-y-auto">
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

// Block DnD event propagation if element have "data-no-dnd" attribute
const handler = ({ nativeEvent: event }: MouseEvent | TouchEvent) => {
  let cur = event.target as HTMLElement;

  while (cur) {
      if (cur.dataset && cur.dataset.noDnd) {
          return false;
      }
      cur = cur.parentElement as HTMLElement;
  }

  return true;
};

class MouseSensor extends LibMouseSensor {
  static activators = [{ eventName: 'onMouseDown', handler }] as typeof LibMouseSensor['activators'];
}

class TouchSensor extends LibTouchSensor {
  static activators = [{ eventName: 'onTouchStart', handler }] as typeof LibTouchSensor['activators'];
}