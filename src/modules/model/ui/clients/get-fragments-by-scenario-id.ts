import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getFragmentsByScenarioId } from "../../presentation/server-actions/get-fragments-by-scenario-id";

export const getFragmentsByScenarioIdKey = (scenarioId: string) => [
  "get-fragments-by-scenario-id",
  scenarioId,
];

export function useGetFragmentsByScenarioId(scenarioId?: string) {
  return useServerQuery({
    enabled: !!scenarioId,
    queryKey: getFragmentsByScenarioIdKey(String(scenarioId)),
    queryFn: () =>
      getFragmentsByScenarioId({ scenarioId: scenarioId as string }),
  });
}
