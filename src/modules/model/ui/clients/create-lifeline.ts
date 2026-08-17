import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { createLifeline } from "../../presentation/server-actions/create-lifeline";
import { getLifelinesByScenarioIdKey } from "./get-lifelines-by-scenario-id";

export function useCreateLifeline(scenarioId: string) {
  return useServerMutation({
    mutationFn: (payload: {
      name: string;
      representedElementType: string;
      representedElementId?: string;
      representedElementExternalId?: string;
      columnIndex: number;
    }) => createLifeline({ scenarioId, ...payload }),
    onSuccess: () => {
      // Query invalidation handled by caller or via queryClient
    },
  });
}
