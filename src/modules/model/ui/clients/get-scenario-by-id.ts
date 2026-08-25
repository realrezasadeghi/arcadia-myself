import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getScenarioById } from "../../presentation/server-actions/get-scenario-by-id";

export const getScenarioByIdKey = (id: string) => ["get-scenario-by-id", id];

export function useGetScenarioById(id?: string) {
  return useServerQuery({
    enabled: !!id,
    queryKey: getScenarioByIdKey(String(id)),
    queryFn: () => getScenarioById({ id: String(id) }),
  });
}
