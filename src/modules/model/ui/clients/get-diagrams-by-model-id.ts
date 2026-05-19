import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getDiagramsByModelId } from "../../presentation/server-actions/get-diagrams-by-model-id";

export const getDiagramsByModelIdKey = (...keys: string[]) => [
  "diagrams",
  ...keys,
];

export function useGetDiagramsByModelId(modelId?: string) {
  return useServerQuery({
    enabled: !!modelId,
    queryKey: getDiagramsByModelIdKey(String(modelId)),
    queryFn: () => getDiagramsByModelId(modelId as string),
  });
}
