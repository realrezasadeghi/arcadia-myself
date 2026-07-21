import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { removeClassRelationship } from "../../presentation/server-actions/remove-class-relationship";

type RemoveClassRelationshipVariables = { id: string; modelId: string };

export function useRemoveClassRelationship() {
  return useServerMutation<boolean, RemoveClassRelationshipVariables>({
    mutationFn: ({ id, modelId }) => removeClassRelationship(id, modelId),
  });
}
