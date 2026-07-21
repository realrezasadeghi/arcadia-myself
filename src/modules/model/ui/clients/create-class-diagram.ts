import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { createClassDiagram } from "../../presentation/server-actions/create-class-diagram";

export function useCreateClassDiagram() {
  return useServerMutation({
    mutationFn: createClassDiagram,
  });
}
