import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { removeClassDiagram } from "../../presentation/server-actions/remove-class-diagram";

type RemoveClassDiagramVariables = { id: string; modelId: string };

export function useRemoveClassDiagram() {
  return useServerMutation<boolean, RemoveClassDiagramVariables>({
    mutationFn: ({ id, modelId }) => removeClassDiagram(id, modelId),
  });
}
