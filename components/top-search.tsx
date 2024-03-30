import { LayoutDashboardIcon, LayoutList, SearchIcon } from "lucide-react";
import { TaskForm } from "./task-form";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";

export const TopSearch = () => {
  return (
    <div className="w-full">
      <Card>
        <CardContent className="flex flex-row">
          <SearchIcon />
          <Input className="w-full" placeholder="Search"></Input>
        </CardContent>
      </Card>
      <div className="w-full flex justify-between pr-7 py-2">
        <div className="flex gap-4">
          <Button>
            <LayoutList></LayoutList>
          </Button>
          <Button>
            <LayoutDashboardIcon />
          </Button>
        </div>

        <TaskForm variant={{ type: "CREATE" }} />
      </div>
    </div>
  );
};
