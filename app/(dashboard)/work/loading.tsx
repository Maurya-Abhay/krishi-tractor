import { Skeleton } from "@/components/ui/skeleton";

export default function WorkLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      <div className="grid gap-3 xl:grid-cols-[1.6fr_1fr]">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </div>
  );
}
