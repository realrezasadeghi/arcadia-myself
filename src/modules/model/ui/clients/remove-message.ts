import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { removeMessage } from "../../presentation/server-actions/remove-message";

export function useRemoveMessage() {
  return useServerMutation({
    mutationFn: (payload: { id: string }) => removeMessage(payload),
  });
}
