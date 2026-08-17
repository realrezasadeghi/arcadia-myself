import { useGetDiagramById } from "../clients/get-diagram-by-id";
import { useGetFragmentsByScenarioId } from "../clients/get-fragments-by-scenario-id";
import { useGetLifelinesByScenarioId } from "../clients/get-lifelines-by-scenario-id";
import { useGetMessagesByScenarioId } from "../clients/get-messages-by-scenario-id";

type ScenarioDiagramDataProps = {
  diagramId: string;
  modelId: string;
};

export function useScenarioDiagramData({
  diagramId,
  modelId,
}: ScenarioDiagramDataProps) {
  const diagramQuery = useGetDiagramById(diagramId);
  const lifelinesQuery = useGetLifelinesByScenarioId(diagramId);
  const messagesQuery = useGetMessagesByScenarioId(diagramId);
  const fragmentsQuery = useGetFragmentsByScenarioId(diagramId);

  return {
    diagram: diagramQuery.data ?? null,
    lifelines: lifelinesQuery.data ?? [],
    messages: messagesQuery.data ?? [],
    fragments: fragmentsQuery.data ?? [],
    isLoading:
      diagramQuery.isLoading ||
      lifelinesQuery.isLoading ||
      messagesQuery.isLoading ||
      fragmentsQuery.isLoading,
    isError:
      diagramQuery.isError ||
      lifelinesQuery.isError ||
      messagesQuery.isError ||
      fragmentsQuery.isError,
  };
}
