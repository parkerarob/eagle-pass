import { Skeleton } from "./ui/skeleton";

export function PageLoading() {
  return (
    <div className="space-y-2 p-4">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}
