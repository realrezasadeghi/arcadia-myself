import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getScenarioData } from "@/modules/model/presentation/server-actions/scenario/get-data";

export const getScenarioDataKey = (diagramId: string) => ["get-scenario-data", diagramId];

export function useGetScenarioData(diagramId?: string) {
  return useServerQuery({
    enabled: !!diagramId,
    queryKey: getScenarioDataKey(String(diagramId)),
    queryFn: () => getScenarioData({ diagramId: diagramId as string }),
  });
}