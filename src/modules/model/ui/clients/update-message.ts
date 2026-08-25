import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { updateMessage } from "../../presentation/server-actions/update-message";

export function useUpdateMessage() {
  return useServerMutation({
    mutationFn: (payload: {
      id: string;
      name?: string;
      executionOrder?: number;
    }) => updateMessage(payload),
  });
}
