import { useGetDiagramById } from "../clients/get-diagram-by-id";
import { useGetElementsByModelId } from "../clients/get-elements-by-model-id";
import { useGetRelationshipsByModelId } from "../clients/get-relationships-by-model-id";

type ArchDiagramDataProps = {
  diagramId: string;
  modelId: string;
};

export function useArchDiagramData({
  diagramId,
  modelId,
}: ArchDiagramDataProps) {
  const diagramQuery = useGetDiagramById(diagramId);
  const elementsQuery = useGetElementsByModelId(modelId);
  const relationshipsQuery = useGetRelationshipsByModelId(modelId);

  return {
    diagram: diagramQuery.data ?? null,
    elements: elementsQuery.data ?? [],
    relationships: relationshipsQuery.data ?? [],
    isLoading:
      diagramQuery.isLoading ||
      elementsQuery.isLoading ||
      relationshipsQuery.isLoading,
    isError:
      diagramQuery.isError ||
      elementsQuery.isError ||
      relationshipsQuery.isError,
  };
}
