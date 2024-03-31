import { Task, TaskTag } from "@/graphql/types";
import {
  TASK_STATUS_TIME,
  checkTaskStatus,
  convertDeprecatedURL,
  convertEstimateToReadbleNumber,
  generateDiceBearUrl,
} from "@/lib/utils";
import { DotsIcon } from "./icons";
import { TaskForm } from "./task-form";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { format } from "date-fns";
import { AlarmClockIcon } from "lucide-react";
import Image from "next/image";
import { TaskDelete } from "./task-delete";

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

export const TaskCard = ({ task }: { task: Task }) => {
  return (
    <Card className="w-full" >
      <CardHeader className="flex flex-row justify-between align-middle items-center">
        <p className="text-lg font-medium">{task.name}</p>
        <DropdownMenu data-no-dnd="true">
          <DropdownMenuTrigger data-no-dnd="true">
            <DotsIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent data-no-dnd="true">
            <TaskForm
              data-no-dnd="true"
              variant={{
                type: "UPDATE",
                value: task,
              }}
            />
            <TaskDelete data-no-dnd="true" taskId={task.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row justify-between">
          <p>
            {`${convertEstimateToReadbleNumber(task.pointEstimate)} points`}
          </p>
          <TaskOnTime dueDate={new Date(task.dueDate)} />
        </div>
        <div className="flex pt-3">
          {(task.tags as TaskTag[]).map((e) => (
            <Badge variant="outline" key={e} className="p-2">
              {e}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Avatar>
          <AvatarImage
            src={convertDeprecatedURL(
              task.assignee?.avatar ?? "",
              task.assignee?.fullName ?? "",
            )}
          />
          <AvatarFallback>
            {task.assignee?.fullName ? (
              <Image
                src={generateDiceBearUrl(task.assignee.fullName)}
                width={64}
                alt={"user - icon"}
                height={64}
              />
            ) : (
              <>-</>
            )}
          </AvatarFallback>
        </Avatar>
      </CardFooter>
    </Card>
  );
};
