import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerProfileLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Skeleton className="h-8 w-56" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-10 w-64 rounded-xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  );
}
