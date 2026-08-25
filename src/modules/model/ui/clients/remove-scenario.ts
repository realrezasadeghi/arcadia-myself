import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { removeScenario } from "../../presentation/server-actions/remove-scenario";

export function useRemoveScenario() {
  return useServerMutation({
    mutationFn: (payload: { id: string }) => removeScenario(payload),
  });
}
