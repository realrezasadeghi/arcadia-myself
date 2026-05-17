import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { updateDiagramLayout } from "../../presentation/server-actions/update-diagram-layout";

export function useUpdateDiagramLayout() {
  return useServerMutation({
    mutationFn: updateDiagramLayout,
  });
}
