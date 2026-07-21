import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { updateClassDiagram } from "../../presentation/server-actions/update-class-diagram";

export function useUpdateClassDiagram() {
  return useServerMutation({
    mutationFn: updateClassDiagram,
  });
}
