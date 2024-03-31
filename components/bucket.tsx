"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Task } from "@/graphql/types";
import { useState } from "react";

import { Draggable } from "./draggable";
import { TaskCard } from "./task-card";
import { Skeleton } from "./ui/skeleton";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: "Task Name",
  },
  {
    accessorKey: "tags",
    header: "Task Tags",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
  },
  {
    accessorKey: "pointEstimate",
    header: "Estimate",
  },
  {
    accessorKey: "assignee",
    header: "Task Assign Name",
  },
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
  },
  {
    accessorKey: "creator",
    header: "Creator",
  },
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
  },
];

export function BucketColumn({
  header,
  tasks,
  isLoading,
}: {
  header: string;
  tasks: Task[];
  isLoading: boolean;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: tasks,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="flex flex-col flex-1 min-h-20">
      <p className="text-lg font-medium">{header}</p>
      <div className="max-w-72 md:max-w-3xl  flex flex-col overflow-visible relative">
        {isLoading ? (
          <Skeleton className="w-full min-h-60 mt-2 rounded-md bg-gray-600/50" />
        ) : (
          table.getRowModel().rows.map((row) => (
            <Draggable id={row.getValue("id")} key={row.getValue("id")}>
              <TaskCard
                task={{
                  creator: row.getValue("creator"),
                  assignee: row.getValue("assignee"),
                  createdAt: row.getValue("createdAt"),
                  dueDate: row.getValue("dueDate"),
                  id: row.getValue("id"),
                  name: row.getValue("name"),
                  pointEstimate: row.getValue("pointEstimate"),
                  position: row.getValue("position"),
                  status: row.getValue("status"),
                  tags: row.getValue("tags"),
                }}
              />
            </Draggable>
          ))
        )}
      </div>
    </div>
  );
}
