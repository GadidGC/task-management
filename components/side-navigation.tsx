import { LayoutDashboardIcon, LayoutList } from "lucide-react";
import { RavnIcon } from "./icons";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";

export const SideNavigation = () => {
  return (
    <Card className="px-4 ">
      <CardHeader className="pb-16">
        <CardTitle className="flex justify-center">
          <RavnIcon />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-5 flex-col">
        <Link href={"/wip"}  className="pr-12 flex flex-row gap-3">
          <LayoutDashboardIcon></LayoutDashboardIcon> DASHBOARD
        </Link>
        <Link href={"/wip"} className="pr-12 flex flex-row gap-3">
          <LayoutList></LayoutList>
          MY TASK
        </Link>
      </CardContent>
    </Card>
  );
};
