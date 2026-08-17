import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { createMessage } from "../../presentation/server-actions/create-message";

export function useCreateMessage(scenarioId: string) {
  return useServerMutation({
    mutationFn: (payload: {
      name: string;
      kind: string;
      sourceLifelineId: string;
      targetLifelineId: string;
      executionOrder: number;
      exchangedItemId?: string;
    }) => createMessage({ scenarioId, ...payload }),
  });
}
