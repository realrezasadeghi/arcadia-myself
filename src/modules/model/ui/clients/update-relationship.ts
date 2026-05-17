import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { updateRelationship } from "../../presentation/server-actions/update-relationship";

export function useUpdateRelationship() {
  return useServerMutation({
    mutationFn: updateRelationship,
  });
}
