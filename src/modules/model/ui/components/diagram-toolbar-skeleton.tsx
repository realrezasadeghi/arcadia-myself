import { Skeleton } from "@/modules/shared/ui/components/ui/skeleton";

export function DiagramToolbarSkeleton() {
  return (
    <div className="flex items-center justify-between h-11 shrink-0 gap-1 border-b bg-background px-6">
      {/* breadcrumb area skeleton */}
      <div className="flex items-center gap-1.5">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-3 w-0.5 rounded-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-0.5 rounded-full" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-0.5 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* actions area skeleton */}
      <div className="flex items-center gap-2">
        {/* save status */}
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="h-5 w-0.5 rounded-full" />

        {/* undo + redo */}
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="h-5 w-0.5 rounded-full" />

        {/* delete */}
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="h-5 w-0.5 rounded-full" />

        {/* download */}
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="h-5 w-0.5 rounded-full" />

        {/* zoom / fit */}
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="size-7 rounded-full" />
      </div>
    </div>
  );
}
