import { DiagramCanvas } from "@/modules/model/ui/components/diagram-canvas";
import { DiagramElementPalette } from "@/modules/model/ui/components/diagram-element-palette";
import { DiagramPropertiesPanel } from "@/modules/model/ui/components/diagram-properties-panel";
import { DiagramToolbar } from "@/modules/model/ui/components/diagram-toolbar";
import { DiagramToolbarSkeleton } from "@/modules/model/ui/components/diagram-toolbar-skeleton";
import { ErrorBoundary } from "@/modules/shared/ui/components/common/error-boundary";
import { TooltipProvider } from "@/modules/shared/ui/components/ui/tooltip";
import { Suspense } from "react";

type Props = {
  params: Promise<{ id: string; diagramId: string }>;
};

export default function Page({ params }: Props) {
  return (
    <ErrorBoundary>
      <TooltipProvider delayDuration={300}>
        <div className="min-h-screen flex flex-col overflow-hidden">
          <Suspense fallback={<DiagramToolbarSkeleton />}>
            <DiagramToolbar params={params} />
          </Suspense>
          <div className="flex flex-1 overflow-hidden">
            <Suspense>
              <DiagramPropertiesPanel params={params} />
            </Suspense>
            <Suspense>
              <DiagramCanvas params={params} />
            </Suspense>
            <Suspense>
              <DiagramElementPalette params={params} />
            </Suspense>
          </div>
        </div>
      </TooltipProvider>
    </ErrorBoundary>
  );
}
