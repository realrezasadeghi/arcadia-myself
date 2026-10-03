import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { updateScenario } from "../../presentation/server-actions/update-scenario";

export function useUpdateScenario() {
  return useServerMutation({
    mutationFn: (payload: { id: string; name: string; description?: string }) =>
      updateScenario(payload),
  });
}
