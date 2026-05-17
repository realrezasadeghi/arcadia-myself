import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { removeRelationship } from "../../presentation/server-actions/remove-relationship";

export function useRemoveRelationship() {
  return useServerMutation({
    mutationFn: removeRelationship,
  });
}
