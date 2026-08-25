import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { updateLifeline } from "../../presentation/server-actions/update-lifeline";

export function useUpdateLifeline() {
  return useServerMutation({
    mutationFn: (payload: { id: string; name: string }) =>
      updateLifeline(payload),
  });
}
