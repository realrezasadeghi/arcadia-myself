import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { createDiagram } from "../../presentation/server-actions/create-diagram";

export function useCreateDiagram() {
  return useServerMutation({
    mutationFn: createDiagram,
  });
}
