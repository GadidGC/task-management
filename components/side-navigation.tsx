import { RavnIcon } from "./icons";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const SideNavigation = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <RavnIcon />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>DASHBOARD</div>
        <div>MY TASK</div>
      </CardContent>
    </Card>
  );
};
