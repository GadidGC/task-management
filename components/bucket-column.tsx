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
import * as React from "react";

import {
  FilterTaskInput,
  MutationUpdateTaskArgs,
  Status,
  Task,
  TaskTag,
  UpdateTaskInput,
  User,
} from "@/generated/graphql";
import { GET_TASKS } from "@/graphql/queries.graphql";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@apollo/client";
import { UPDATE_TASK } from "@/graphql/mutations.graphql";
import { TaskUpdateForm } from "./task-form";

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
      <div className="min-w-80 max-w-3xl">
        {table.getRowModel().rows.map((row) => (
          <Card key={row.id} className="mt-2">
            <CardHeader className="flex flex-row justify-between align-middle items-center">
              <CardTitle>{row.getValue("name")}</CardTitle>
              <TaskUpdateForm
                task={{
                  creator: row.getValue("creator"),
                  assignee: row.getValue("name"),
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
            </CardHeader>
            <CardContent>
              <p>{row.getValue("pointEstimate")}</p>
              {(row.getValue("tags") as TaskTag[]).map((e) => (
                <Badge variant="outline" key={e}>
                  {e}
                </Badge>
              ))}
            </CardContent>
            <CardFooter>
              {row.getValue("assignee")}
              <Avatar>
                <AvatarImage
                  src={(row.getValue("assignee") as User)?.avatar ?? ""}
                />
                <AvatarFallback>-</AvatarFallback>
              </Avatar>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
