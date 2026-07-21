import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getClassElementsByModelId } from "../../presentation/server-actions/get-class-elements-by-model-id";

export function useClassElementsByModelId(modelId: string, layer?: string) {
  return useServerQuery({
    queryKey: ["class-elements", modelId, layer],
    queryFn: () => getClassElementsByModelId(modelId, layer),
    enabled: !!modelId,
  });
}
