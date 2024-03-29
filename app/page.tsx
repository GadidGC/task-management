import { DataTableDemo } from "@/components/bucket";
import { PollPage } from "./test";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <PollPage/>
      <DataTableDemo/>
    </main>
  );
}
