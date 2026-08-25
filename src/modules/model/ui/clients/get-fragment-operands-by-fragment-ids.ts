import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getFragmentOperandsByFragmentIds } from "../../presentation/server-actions/get-fragment-operands-by-fragment-ids";

export const getFragmentOperandsByFragmentIdsKey = (scenarioId: string) => [
  "get-fragment-operands-by-fragment-ids",
  scenarioId,
];

export function useGetFragmentOperandsByFragmentIds(
  fragmentIds: string[],
  scenarioId: string,
) {
  return useServerQuery({
    enabled: fragmentIds.length > 0,
    queryKey: getFragmentOperandsByFragmentIdsKey(scenarioId),
    queryFn: () => getFragmentOperandsByFragmentIds({ fragmentIds }),
  });
}
