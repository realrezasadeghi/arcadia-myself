import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { updateDiagram } from "../../presentation/server-actions/update-diagram";

export function useUpdateDiagram() {
  return useServerMutation({
    mutationFn: updateDiagram,
  });
}
