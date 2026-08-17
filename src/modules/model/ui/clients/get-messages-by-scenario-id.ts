import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getMessagesByScenarioId } from "../../presentation/server-actions/get-messages-by-scenario-id";

export const getMessagesByScenarioIdKey = (scenarioId: string) => [
  "get-messages-by-scenario-id",
  scenarioId,
];

export function useGetMessagesByScenarioId(scenarioId?: string) {
  return useServerQuery({
    enabled: !!scenarioId,
    queryKey: getMessagesByScenarioIdKey(String(scenarioId)),
    queryFn: () =>
      getMessagesByScenarioId({ scenarioId: scenarioId as string }),
  });
}
