import { Skeleton } from "@/modules/shared/ui/components/ui/skeleton";

export function ProjectListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i.toString()} className="rounded-xl border bg-card p-5">
          {/* Top: icon + actions */}
          <div className="flex items-start justify-between mb-4">
            <Skeleton className="h-11 w-11 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>

          {/* Title + description */}
          <div className="mb-4 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Layer badges */}
          <div className="flex items-center gap-1.5 mb-4">
            <Skeleton className="h-6 w-12 rounded-md" />
            <Skeleton className="h-6 w-12 rounded-md" />
            <Skeleton className="h-6 w-12 rounded-md" />
            <Skeleton className="h-6 w-12 rounded-md" />
            <Skeleton className="h-6 w-14 rounded-md" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}
