import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { updateClassDiagramLayout } from "../../presentation/server-actions/update-class-diagram-layout";

export function useUpdateClassDiagramLayout() {
  return useServerMutation({
    mutationFn: updateClassDiagramLayout,
  });
}
