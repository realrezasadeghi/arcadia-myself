import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { updateFragment } from "../../presentation/server-actions/update-fragment";

export function useUpdateFragment() {
  return useServerMutation({
    mutationFn: (payload: { id: string; name: string; guard?: string }) =>
      updateFragment(payload),
  });
}
