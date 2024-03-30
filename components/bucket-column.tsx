"use client";

export const dynamic = "force-dynamic";

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
  DeleteTaskInput,
  MutationDeleteTaskArgs,
  Task,
  TaskTag,
  User,
} from "@/graphql/types";
import { checkTaskStatus } from "@/lib/utils";
import { DotsIcon } from "./icons";
import { TaskForm } from "./task-form";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_TASK } from "@/graphql/mutations.graphql";

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
];

export function BucketColumn({
  header,
  tasks,
}: {
  header: string;
  tasks: Task[];
}) {
  const [mutate, { loading, error }] =
    useMutation<MutationDeleteTaskArgs>(DELETE_TASK);

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

  const handleOnClickDelete = (id: string) => {
    mutate({ variables: { input: { id } as DeleteTaskInput } });
  };

  return (
    <div>
      {header}
      <div className="min-w-80 max-w-3xl">
        {table.getRowModel().rows.map((row) => (
          <Card key={row.id} className="mt-2">
            <CardHeader className="flex flex-row justify-between align-middle items-center">
              <CardTitle>{row.getValue("name")}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <DotsIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <TaskForm
                    variant={{
                      type: "UPDATE",
                      value: {
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
                      },
                    }}
                  />
                  <Button
                    onClick={() => handleOnClickDelete(row.getValue("id"))}
                  >
                    Delete
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="flex flex-row justify-between">
                <p>{row.getValue("pointEstimate")}</p>
                {checkTaskStatus(new Date(row.getValue("dueDate")))}
              </div>
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
