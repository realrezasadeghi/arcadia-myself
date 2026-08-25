import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { createScenario } from "../../presentation/server-actions/create-scenario";

export function useCreateScenario() {
  return useServerMutation({
    mutationFn: (payload: {
      modelId: string;
      name: string;
      description?: string;
      scenarioType: string;
    }) => createScenario(payload),
  });
}
