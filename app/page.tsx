"use client";

export const dynamic = "force-dynamic";

import { BucketColumn } from "@/components/bucket-column";
import { SideNavigation } from "@/components/side-navigation";
import { TopSearch } from "@/components/top-search";
import { GET_TASKS } from "@/graphql/queries.graphql";
import { FilterTaskInput, Status, Task } from "@/graphql/types";
import { useQuery } from "@apollo/client";

export default function Home() {
  const { data } = useQuery<{ tasks: Task[] }>(GET_TASKS, {
    variables: {
      input: {} as FilterTaskInput,
    },
    pollInterval: 500,
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

  return (
    <main className="flex min-h-screen flex-row justify-start gap-10">
      <SideNavigation />
      <div className="flex flex-col w-full">
        <TopSearch />
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
