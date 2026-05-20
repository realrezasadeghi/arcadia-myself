import { Skeleton } from "@/modules/shared/ui/components/ui/skeleton";
import { LAYER_PAIRS } from "../constants/trace-link";

export function TraceLayerPairListSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      {LAYER_PAIRS.map(({ label }) => (
        <div key={label} className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>

          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-muted/60">
                  <th className="sticky right-0 z-10 bg-muted/60 border-b border-l border-border px-3 py-2 min-w-35">
                    <Skeleton className="h-4 w-24" />
                  </th>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <th
                      key={index.toString()}
                      className="border-b border-l border-border px-2 py-2 min-w-25 max-w-35"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Skeleton className="h-2.5 w-2.5 rounded-sm" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 4 }).map((_, rowIdx) => {
                  const isEven = rowIdx % 2 === 0;
                  const bgStyle = {
                    backgroundColor: isEven
                      ? "hsl(var(--background))"
                      : "hsl(var(--muted) / 0.2)",
                  };

                  return (
                    <tr
                      key={rowIdx.toString()}
                      className={isEven ? "bg-background" : "bg-muted/20"}
                    >
                      <td
                        className="sticky right-0 z-10 border-b border-l border-border px-3 py-2"
                        style={bgStyle}
                      >
                        <div className="flex items-center gap-1.5">
                          <Skeleton className="h-2.5 w-2.5 rounded-sm" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </td>
                      {Array.from({ length: 3 }).map((_, colIdx) => (
                        <td
                          key={colIdx.toString()}
                          className="border-b border-l border-border px-2 py-2 text-center"
                        >
                          <Skeleton className="mx-auto h-3 w-3 rounded-full" />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
