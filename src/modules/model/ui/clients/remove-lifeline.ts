import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { removeLifeline } from "../../presentation/server-actions/remove-lifeline";

export function useRemoveLifeline() {
  return useServerMutation({
    mutationFn: (payload: { id: string }) => removeLifeline(payload),
  });
}
