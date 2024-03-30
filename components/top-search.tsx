"use client";
import { PointEstimate, TaskTag } from "@/graphql/types";
import {
  FilterIcon,
  LayoutDashboardIcon,
  LayoutList,
  SearchIcon,
} from "lucide-react";
import { TaskForm } from "./task-form";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";

export const TopSearch = ({
  estimateFilter,
  tagFilter,
  onSetNameFilter,
  updateEstimateFilter,
  udpateTagFilter,
}: {
  estimateFilter: string;
  tagFilter: TaskTag[];
  onSetNameFilter: (name: string) => void;
  updateEstimateFilter: (estimate: PointEstimate) => void;
  udpateTagFilter: (tags: TaskTag[]) => void;
}) => {
  return (
    <div className="w-full">
      <Card>
        <CardContent className="flex flex-row w-full">
          <SearchIcon />
          <div className="w-full">
            <Input
              className="w-full"
              placeholder="Search"
              onChange={(event) => {
                onSetNameFilter(event.target.value);
              }}
            />

            <DropdownMenu>
              <DropdownMenuTrigger className="flex flex-row">
                <FilterIcon />
                Filter
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>estimate</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup
                        value={estimateFilter}
                        onValueChange={(value) =>
                          updateEstimateFilter(value as PointEstimate)
                        }
                      >
                        {Object.values(PointEstimate).map((estimate, idx) => (
                          <DropdownMenuRadioItem value={estimate} key={idx}>
                            {estimate}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>tags</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {Object.values(TaskTag).map((tag, idx) => (
                        <DropdownMenuCheckboxItem
                          key={idx}
                          checked={tagFilter.includes(tag)}
                          onCheckedChange={() => {
                            if (tagFilter.includes(tag)) {
                              const filtered = [
                                ...tagFilter.filter((e) => e != tag),
                              ];
                              udpateTagFilter(filtered);
                              return;
                            }
                            const filtered = [...tagFilter, tag];
                            udpateTagFilter(filtered);
                          }}
                        >
                          {tag}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Link href={"/settings"}>
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>G</AvatarFallback>
            </Avatar>
          </Link>
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
