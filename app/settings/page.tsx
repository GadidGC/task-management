import { RavnIcon } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GET_PROFILE } from "@/graphql/queries.graphql";
import { User } from "@/graphql/types";
import { getClient } from "@/lib/client";
import { format } from "date-fns";
import Link from "next/link";

const Background = () => {
  return (
    <div className="absolute min-h-screen w-screen overflow-hidden -z-50 justify-center items-center">
      <div className="absolute min-h-screen w-screen -z-50 justify-center items-center">
        <div className="relative flex flex-wrap justify-center items-center">
          {[...Array(200)].map((_, index) => (
            <div
              key={index}
              className="flex-none w-10 h-10 rounded-full bg-opacity-50 transform rotate-45 m-8 opacity-5"
            >
              <RavnIcon />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default async function Settings() {
  const { data } = await getClient().query<{ profile: User }>({
    query: GET_PROFILE,
  });
  return (
    <main className="flex min-h-screen flex-row justify-center min-w-full align-middle items-center">
      <Background />
      <Card className="">
        <CardHeader className="flex flex-col items-center gap-3">
          <Avatar className="size-12">
            <AvatarImage src={data.profile.avatar ?? ""} />
            <AvatarFallback>G</AvatarFallback>
          </Avatar>
          <CardTitle>{data.profile.fullName}</CardTitle>
          <CardDescription>{data.profile.email}</CardDescription>
        </CardHeader>
        <CardContent className="gap-2 flex flex-col">
          <div className="flex flex-row justify-between w-full">
            <p>User CHANGE TEST:</p>
            <p>{data.profile.type}</p>
          </div>
          <div className="flex flex-row justify-between w-full">
            <p>Updated at:</p>
            <p>{format(new Date(data.profile.updatedAt), "MMMM d, yyyy")}</p>
          </div>
          <div className="flex flex-row justify-between w-full">
            <p>Created at:</p>
            <p>{format(new Date(data.profile.updatedAt), "MMMM d, yyyy")}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between flex-col w-full gap-2">
          <Link className="border p-2 rounded-sm" href={"/"}>
            Back to dashboard
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
