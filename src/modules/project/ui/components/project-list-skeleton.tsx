import { Skeleton } from "@/modules/shared/ui/components/ui/skeleton";

export function ProjectListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-6 py-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i.toString()}
          className="rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          {/* CardHeader */}
          <div className="p-6 pb-3 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-1.5 mt-2">
              <Skeleton className="h-5 w-10 rounded-full" />
              <Skeleton className="h-5 w-10 rounded-full" />
              <Skeleton className="h-5 w-10 rounded-full" />
              <Skeleton className="h-5 w-10 rounded-full" />
            </div>
          </div>

          {/* CardContent */}
          <div className="p-6 pt-0 mt-auto">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
