import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { createFragment } from "../../presentation/server-actions/create-fragment";

export function useCreateFragment(scenarioId: string) {
  return useServerMutation({
    mutationFn: (payload: {
      name: string;
      operator: string;
      guard?: string;
      rowIndex: number;
      columnIndex: number;
      spanColumns?: number;
    }) => createFragment({ scenarioId, ...payload }),
  });
}
