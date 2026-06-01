import { TraceHeaderBreadcrumb } from "@/modules/model/ui/components/trace-header-breadcrumb";
import { TraceLayerPairList } from "@/modules/model/ui/components/trace-layer-pair-list";
import { TraceLayerPairListSkeleton } from "@/modules/model/ui/components/trace-layer-pair-list-skeleton";
import { TraceLayersPage } from "@/modules/model/ui/components/trace-layers-page";
import { Skeleton } from "@/modules/shared/ui/components/ui/skeleton";
import type { Metadata } from "next";
import { Suspense } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "لیست ردیابی ها",
};

function TraceHeaderBreadcrumbSkeleton() {
  return (
    <div className="max-w-6xl mx-auto">
      <Skeleton className="w-full h-8" />
    </div>
  );
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-full">
      <Suspense fallback={<TraceHeaderBreadcrumbSkeleton />}>
        <TraceHeaderBreadcrumb params={params} />
      </Suspense>

      <Suspense fallback={<TraceLayerPairListSkeleton />}>
        <div className="max-w-6xl mx-auto w-full">
          <TraceLayersPage projectId={resolvedParams.id} />
        </div>
      </Suspense>

      <Suspense fallback={<TraceLayerPairListSkeleton />}>
        <div className="max-w-6xl mx-auto w-full">
          <TraceLayerPairList params={params} />
        </div>
      </Suspense>
    </div>
  );
}
