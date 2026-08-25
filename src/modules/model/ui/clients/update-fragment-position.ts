import { useQueryClient } from "@tanstack/react-query";
import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { updateFragmentPosition } from "../../presentation/server-actions/update-fragment-position";
import { getFragmentsByScenarioIdKey } from "./get-fragments-by-scenario-id";

export function useUpdateFragmentPosition(scenarioId: string) {
  const queryClient = useQueryClient();

  return useServerMutation({
    mutationFn: (payload: {
      id: string;
      rowIndex: number;
      columnIndex: number;
      spanColumns?: number;
    }) => updateFragmentPosition(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getFragmentsByScenarioIdKey(scenarioId),
      });
    },
  });
}
