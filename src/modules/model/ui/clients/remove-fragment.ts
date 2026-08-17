import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { removeFragment } from "../../presentation/server-actions/remove-fragment";

export function useRemoveFragment() {
  return useServerMutation({
    mutationFn: (payload: { id: string }) => removeFragment(payload),
  });
}
