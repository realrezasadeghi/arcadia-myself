import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { updateClassRelationship } from "../../presentation/server-actions/update-class-relationship";

export function useUpdateClassRelationship() {
  return useServerMutation({
    mutationFn: updateClassRelationship,
  });
}
