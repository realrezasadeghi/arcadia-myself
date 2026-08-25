"use client";

import { AlertTriangle } from "lucide-react";
import { Spinner } from "@/modules/shared/ui/components/ui/spinner";
import { useScenarioDiagramData } from "../hooks/use-scenario-diagram-data";
import type { DiagramTypeValue } from "../types/diagram";
import { ScenarioCanvasInner } from "./scenario-canvas-inner";

type ScenarioDiagramCanvasProps = {
  diagramId: string;
  modelId: string;
};

export function ScenarioDiagramCanvas({
  diagramId,
  modelId,
}: ScenarioDiagramCanvasProps) {
  const {
    diagram,
    lifelines,
    messages,
    fragments,
    fragmentOperands,
    isLoading,
    isError,
  } = useScenarioDiagramData({ diagramId, modelId });

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError || !diagram) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
        <AlertTriangle className="size-8 opacity-40" />
        <p className="text-sm">Failed to load scenario</p>
      </div>
    );
  }

  return (
    <ScenarioCanvasInner
      diagram={{
        id: diagram.id,
        modelId: diagram.modelId,
        type: diagram.type as DiagramTypeValue,
        name: diagram.name,
      }}
      lifelines={lifelines}
      messages={messages}
      fragments={fragments}
      fragmentOperands={fragmentOperands}
    />
  );
}
