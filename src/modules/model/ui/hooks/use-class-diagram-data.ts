import { useGetClassDiagramById } from "../clients/get-class-diagram-by-id";
import { useClassElementsByModelId } from "../clients/get-class-elements-by-model-id";
import { useClassRelationshipsByModelId } from "../clients/get-class-relationships-by-model-id";

type ClassDiagramDataProps = {
  diagramId: string;
  modelId: string;
};

export function useClassDiagramData({
  diagramId,
  modelId,
}: ClassDiagramDataProps) {
  const diagramQuery = useGetClassDiagramById(diagramId);
  const elementsQuery = useClassElementsByModelId(modelId);
  const relationshipsQuery = useClassRelationshipsByModelId(modelId);

  const error =
    diagramQuery.error ?? elementsQuery.error ?? relationshipsQuery.error;

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
    error: error instanceof Error ? error.message : null,
    refetchElements: elementsQuery.refetch,
    refetchRelationships: relationshipsQuery.refetch,
  };
}
