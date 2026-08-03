import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { removeDiagram } from "../../presentation/server-actions/remove-diagram";

export function useRemoveDiagram() {
  return useServerMutation({
    mutationFn: (id: string) => removeDiagram(id),
  });
}
