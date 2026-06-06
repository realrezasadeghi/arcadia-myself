import { TraceHeaderBreadcrumb } from "@/modules/model/ui/components/trace-header-breadcrumb";
import { TraceLayerPairList } from "@/modules/model/ui/components/trace-layer-pair-list";
import { TraceLayerPairListSkeleton } from "@/modules/model/ui/components/trace-layer-pair-list-skeleton";
import { Skeleton } from "@/modules/shared/ui/components/ui/skeleton";
import type { Metadata } from "next";
import { Suspense } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Traceability Matrix",
};

function TraceHeaderBreadcrumbSkeleton() {
  return (
    <div className="max-w-6xl mx-auto">
      <Skeleton className="w-full h-8" />
    </div>
  );
}

export default function Page({ params }: Props) {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto">
      <Suspense fallback={<TraceHeaderBreadcrumbSkeleton />}>
        <TraceHeaderBreadcrumb params={params} />
      </Suspense>
      <Suspense fallback={<TraceLayerPairListSkeleton />}>
        <TraceLayerPairList params={params} />
      </Suspense>
    </div>
  );
}
