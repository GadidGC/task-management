import { BucketColumn } from "@/components/bucket-column";
import { BucketList } from "@/components/bucket-list";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <BucketColumn />
      <BucketList />
    </main>
  );
}
