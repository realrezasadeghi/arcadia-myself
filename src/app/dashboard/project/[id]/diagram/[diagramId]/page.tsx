import { getDiagramById } from "@/modules/model/presentation/server-actions/get-diagram-by-id";
import { DiagramCanvas } from "@/modules/model/ui/components/diagram-canvas";
import { DiagramElementPalette } from "@/modules/model/ui/components/diagram-element-palette";
import { DiagramPropertiesPanel } from "@/modules/model/ui/components/diagram-properties-panel";
import { DiagramToolbar } from "@/modules/model/ui/components/diagram-toolbar";
import { DiagramToolbarSkeleton } from "@/modules/model/ui/components/diagram-toolbar-skeleton";
import { ErrorBoundary } from "@/modules/shared/ui/components/common/error-boundary";
import { Spinner } from "@/modules/shared/ui/components/ui/spinner";
import { TooltipProvider } from "@/modules/shared/ui/components/ui/tooltip";
import { ReactFlowProvider } from "@xyflow/react";
import type { Metadata } from "next";
import { Suspense } from "react";

type Props = {
  params: Promise<{ id: string; diagramId: string }>;
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { diagramId } = await params;
  const diagram = await getDiagramById(diagramId);
  return {
    title: diagram?.data?.name,
    description: diagram?.data?.description,
  };
};

export default function Page({ params }: Props) {
  return (
    <ErrorBoundary>
      <TooltipProvider delayDuration={300}>
        <ReactFlowProvider>
          <div className="min-h-screen flex flex-col overflow-hidden">
            <Suspense fallback={<DiagramToolbarSkeleton />}>
              <DiagramToolbar params={params} />
            </Suspense>
            <div className="flex flex-1 overflow-hidden">
              <Suspense>
                <DiagramPropertiesPanel params={params} />
              </Suspense>
              <Suspense
                fallback={
                  <div className="w-full h-screen flex items-center justify-center">
                    <Spinner />
                  </div>
                }
              >
                <DiagramCanvas params={params} />
              </Suspense>
              <Suspense>
                <DiagramElementPalette params={params} />
              </Suspense>
            </div>
          </div>
        </ReactFlowProvider>
      </TooltipProvider>
    </ErrorBoundary>
  );
}
