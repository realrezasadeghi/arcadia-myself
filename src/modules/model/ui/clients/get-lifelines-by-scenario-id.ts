import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getLifelinesByScenarioId } from "../../presentation/server-actions/get-lifelines-by-scenario-id";

export const getLifelinesByScenarioIdKey = (scenarioId: string) => [
  "get-lifelines-by-scenario-id",
  scenarioId,
];

export function useGetLifelinesByScenarioId(scenarioId?: string) {
  return useServerQuery({
    enabled: !!scenarioId,
    queryKey: getLifelinesByScenarioIdKey(String(scenarioId)),
    queryFn: () =>
      getLifelinesByScenarioId({ scenarioId: scenarioId as string }),
  });
}
