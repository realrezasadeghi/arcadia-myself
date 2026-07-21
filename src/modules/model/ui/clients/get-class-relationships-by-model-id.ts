import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getClassRelationshipsByModelId } from "../../presentation/server-actions/get-class-relationships-by-model-id";

export function useClassRelationshipsByModelId(modelId: string, layer?: string) {
  return useServerQuery({
    queryKey: ["class-relationships", modelId, layer],
    queryFn: () => getClassRelationshipsByModelId(modelId, layer),
    enabled: !!modelId,
  });
}
