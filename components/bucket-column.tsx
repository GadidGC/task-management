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

import { DELETE_TASK } from "@/graphql/mutations.graphql";
import {
  DeleteTaskInput,
  MutationDeleteTaskArgs,
  Task,
  TaskTag,
  User,
} from "@/graphql/types";
import {
  TASK_STATUS_TIME,
  checkTaskStatus,
  convertDeprecatedURL,
  convertEstimateToReadbleNumber,
  generateDiceBearUrl,
} from "@/lib/utils";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { DotsIcon } from "./icons";
import { TaskForm } from "./task-form";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
import { AlarmClockIcon } from "lucide-react";
import { Draggable } from "./draggable";
import { format } from "date-fns";
import Image from "next/image";

function TaskOnTime({ dueDate }: { dueDate: Date }) {
  if (checkTaskStatus(dueDate) === TASK_STATUS_TIME.LATE) {
    return (
      <Badge className="bg-red-100 text-red-600 gap-2">
        <AlarmClockIcon /> {format(dueDate, "dd MMMM yyyy")}
      </Badge>
    );
  }

  if (checkTaskStatus(dueDate) === TASK_STATUS_TIME.ALMOST_LATE) {
    return (
      <Badge className="bg-yellow-100 text-yellow-600 gap-2">
        <AlarmClockIcon /> {format(dueDate, "dd MMMM yyyy")}
      </Badge>
    );
  }

  return (
    <Badge className="bg-transparent/10 gap-2 flex ">
      <AlarmClockIcon /> {format(dueDate, "dd MMMM yyyy")}
    </Badge>
  );
}

export function AlertDialogDemo({
  cancel,
  accept,
}: {
  cancel: () => void;
  accept: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this task
            and remove your task data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => cancel()}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => accept()}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

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
  }
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
    <div className="flex flex-col flex-1">
      <p className="text-lg font-medium">{header}</p>
      <div className="min-w-64 max-w-3xl  flex flex-col overflow-visible relative">
        {table.getRowModel().rows.map((row) => (
          <Draggable id={row.getValue("id")} key={row.getValue("id")}>
            <Card className="w-full">
              <CardHeader className="flex flex-row justify-between align-middle items-center">
                <p className="text-lg font-medium">{row.getValue("name")}</p>
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
                          assignee: row.getValue("assignee"),
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
                    <AlertDialogDemo
                      accept={() => handleOnClickDelete(row.getValue("id"))}
                      cancel={() => { }}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="flex flex-row justify-between">
                  <p>
                    {`${convertEstimateToReadbleNumber(
                      row.getValue("pointEstimate"),
                    )} points`}
                  </p>
                  <TaskOnTime dueDate={new Date(row.getValue("dueDate"))} />
                </div>
                <div className="flex pt-3">
                  {(row.getValue("tags") as TaskTag[]).map((e) => (
                    <Badge variant="outline" key={e} className="p-2">
                      {e}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Avatar>
                  <AvatarImage
                    src={convertDeprecatedURL((row.getValue("assignee") as User)?.avatar ?? "", (row.getValue("assignee") as User)?.fullName ?? "")}
                  />
                  <AvatarFallback><Image src={generateDiceBearUrl((row.getValue("assignee") as User)?.fullName ?? "")} width={64} alt={"user-icon"} height={64} />  </AvatarFallback>
                </Avatar>
              </CardFooter>
            </Card>
          </Draggable>
        ))}
      </div>
    </div>
  );
}
