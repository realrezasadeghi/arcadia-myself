import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getClassDiagramsByModelId } from "../../presentation/server-actions/get-class-diagrams-by-model-id";

export function useClassDiagramsByModelId(modelId: string) {
  return useServerQuery({
    queryKey: ["class-diagrams", modelId],
    queryFn: () => getClassDiagramsByModelId(modelId),
    enabled: !!modelId,
  });
}
