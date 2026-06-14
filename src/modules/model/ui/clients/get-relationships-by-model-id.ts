import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getRelationshipsByModelId } from "../../presentation/server-actions/get-relationships-by-model-id";

export const getRelationshipsByModelIdKey = (modelId: string) => [
  "get-relationships-by-model-id",
  modelId,
];

export function useGetRelationshipsByModelId(modelId?: string) {
  return useServerQuery({
    enabled: !!modelId,
    queryKey: getRelationshipsByModelIdKey(String(modelId)),
    queryFn: () => getRelationshipsByModelId(modelId as string),
  });
}
