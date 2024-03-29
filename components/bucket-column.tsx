"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { FilterTaskInput, Status, Task } from "@/generated/graphql";
import { GET_TASKS } from "@/graphql/queries.graphql";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { Card } from "./ui/card";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
];

export function BucketColumn() {
  // TO DO: Ensure type inference for { tasks: Task[] }
  const { data } = useSuspenseQuery<{ tasks: Task[] }>(GET_TASKS, {
    variables: {
      input: {
        status: Status.Backlog,
      } as FilterTaskInput,
    },
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: data.tasks,
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
    <div>
      Working
      <div className="bg-red-100 max-w-md">
        {table.getRowModel().rows.map((row) => (
          <Card key={row.id} className="mt-2 p-3">
            {row
              .getVisibleCells()
              .map((cell) =>
                flexRender(cell.column.columnDef.cell, cell.getContext()),
              )}
          </Card>
        ))}
      </div>
    </div>
  );
}
