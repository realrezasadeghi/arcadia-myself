import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getElementsByModelId } from "../../presentation/server-actions/get-elements-by-model-id";

const getElementsByModelIdKey = (modelId: string) => [
  "get-elements-by-model-id",
  modelId,
];

export function useGetElementsByModelId(modelId: string) {
  return useServerQuery({
    enabled: !!modelId,
    queryKey: getElementsByModelIdKey(modelId),
    queryFn: () => getElementsByModelId(modelId),
  });
}
