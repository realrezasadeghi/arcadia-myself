import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { createClassRelationship } from "../../presentation/server-actions/create-class-relationship";

export function useCreateClassRelationship() {
  return useServerMutation({
    mutationFn: createClassRelationship,
  });
}
