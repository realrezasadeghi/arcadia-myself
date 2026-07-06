"use client";

import type { ScenarioDiagram } from "@/modules/model/domain/entities/scenario-diagram";
import type { ScenarioLifeline } from "@/modules/model/domain/entities/scenario-lifeline";
import type { ScenarioMessage } from "@/modules/model/domain/entities/scenario-message";
import type { ScenarioFragment } from "@/modules/model/domain/entities/scenario-fragment";
import { Spinner } from "@/modules/shared/ui/components/ui/spinner";
import { AlertTriangle } from "lucide-react";
import { useMemo } from "react";
import { useGetScenarioData } from "../clients/get-scenario-data";
import { ScenarioCanvas } from "./scenario-canvas";

type ScenarioCanvasClientProps = {
  diagramId: string;
  modelId: string;
};

export function ScenarioCanvasClient({
  diagramId,
  modelId,
}: ScenarioCanvasClientProps) {
  const scenarioQuery = useGetScenarioData(diagramId);

  const diagram = useMemo<ScenarioDiagram | null>(() => {
    if (!scenarioQuery.data) return null;
    return scenarioQuery.data.diagram;
  }, [scenarioQuery.data]);

  const lifelines = useMemo<ScenarioLifeline[]>(() => {
    return scenarioQuery.data?.lifelines ?? [];
  }, [scenarioQuery.data]);

  const messages = useMemo<ScenarioMessage[]>(() => {
    return scenarioQuery.data?.messages ?? [];
  }, [scenarioQuery.data]);

  const fragments = useMemo<ScenarioFragment[]>(() => {
    return scenarioQuery.data?.fragments ?? [];
  }, [scenarioQuery.data]);

  const isLoading = scenarioQuery.isLoading;
  const isError = scenarioQuery.isError;

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
        <p className="text-sm">Failed to load scenario diagram</p>
      </div>
    );
  }

  return (
    <ScenarioCanvas
      diagram={diagram}
      lifelines={lifelines}
      messages={messages}
      fragments={fragments}
    />
  );
}
