import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getScenariosByModelId } from "../../presentation/server-actions/get-scenarios-by-model-id";

export const getScenariosByModelIdKey = (modelId: string) => [
  "get-scenarios-by-model-id",
  modelId,
];

export function useGetScenariosByModelId(modelId?: string) {
  return useServerQuery({
    enabled: !!modelId,
    queryKey: getScenariosByModelIdKey(String(modelId)),
    queryFn: () => getScenariosByModelId({ modelId: modelId as string }),
  });
}
