import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { reorderLifelines } from "../../presentation/server-actions/reorder-lifelines";

export function useReorderLifelines() {
  return useServerMutation({
    mutationFn: (payload: { scenarioId: string; lifelineIds: string[] }) =>
      reorderLifelines(payload),
  });
}
