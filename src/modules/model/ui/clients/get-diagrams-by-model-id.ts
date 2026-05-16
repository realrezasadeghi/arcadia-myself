import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getDiagramsByModelId } from "../../presentation/server-actions/get-diagrams-by-model-id";

export function useGetDiagramsByModelId(modelId?: string) {
  return useServerQuery({
    enabled: !!modelId,
    queryKey: ["diagrams", modelId],
    queryFn: () => getDiagramsByModelId(modelId as string),
  });
}
