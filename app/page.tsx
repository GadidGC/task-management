"use client";

export const dynamic = "force-dynamic";

import { BucketColumn } from "@/components/bucket-column";
import { SideNavigation } from "@/components/side-navigation";
import { TopSearch } from "@/components/top-search";
import { GET_TASKS } from "@/graphql/queries.graphql";
import { FilterTaskInput, Status, Task, TaskTag } from "@/graphql/types";
import { useQuery } from "@apollo/client";
import { useState } from "react";

export default function Home() {
  const { data, refetch } = useQuery<{ tasks: Task[] }>(GET_TASKS, {
    variables: {
      input: {},
    },
  });

  const [estimateFilter, setEstimateFilter] = useState<string>("");
  const [tagFilter, setTagFilter] = useState<TaskTag[]>([]);

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

  return (
    <main className="flex min-h-screen flex-row justify-start gap-10">
      <SideNavigation />
      <div className="flex flex-col w-full">
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
        <div className="flex flex-row gap-5">
          {columns.map((column) => (
            <BucketColumn
              key={column.header}
              header={column.header}
              tasks={filterTasksByStatus(column.status)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
