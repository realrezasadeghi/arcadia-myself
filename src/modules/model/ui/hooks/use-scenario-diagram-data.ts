import { useMemo } from "react";
import { useGetFragmentOperandsByFragmentIds } from "../clients/get-fragment-operands-by-fragment-ids";
import { useGetFragmentsByScenarioId } from "../clients/get-fragments-by-scenario-id";
import { useGetLifelinesByScenarioId } from "../clients/get-lifelines-by-scenario-id";
import { useGetMessagesByScenarioId } from "../clients/get-messages-by-scenario-id";
import { useGetScenarioById } from "../clients/get-scenario-by-id";

type ScenarioDiagramDataProps = {
  diagramId: string;
  modelId: string;
};

export function useScenarioDiagramData({
  diagramId,
}: ScenarioDiagramDataProps) {
  const scenarioQuery = useGetScenarioById(diagramId);
  const lifelinesQuery = useGetLifelinesByScenarioId(diagramId);
  const messagesQuery = useGetMessagesByScenarioId(diagramId);
  const fragmentsQuery = useGetFragmentsByScenarioId(diagramId);

  const fragmentIds = useMemo(
    () => (fragmentsQuery.data ?? []).map((f) => f.id),
    [fragmentsQuery.data],
  );

  const operandsQuery = useGetFragmentOperandsByFragmentIds(
    fragmentIds,
    diagramId,
  );

  const scenario = scenarioQuery.data;

  const diagram = scenario
    ? {
        id: scenario.id,
        modelId: scenario.modelId,
        type: scenario.scenarioType,
        name: scenario.name,
        description: scenario.description,
        viewport: { x: 0, y: 0, zoom: 1 },
        elementLayouts: [],
        createdAt: scenario.createdAt,
        updatedAt: scenario.updatedAt,
      }
    : null;

  return {
    diagram,
    lifelines: lifelinesQuery.data ?? [],
    messages: messagesQuery.data ?? [],
    fragments: fragmentsQuery.data ?? [],
    fragmentOperands: operandsQuery.data ?? [],
    isLoading:
      scenarioQuery.isLoading ||
      lifelinesQuery.isLoading ||
      messagesQuery.isLoading ||
      fragmentsQuery.isLoading ||
      operandsQuery.isLoading,
    isError:
      scenarioQuery.isError ||
      lifelinesQuery.isError ||
      messagesQuery.isError ||
      fragmentsQuery.isError ||
      operandsQuery.isError,
  };
}
