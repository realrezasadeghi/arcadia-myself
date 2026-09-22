import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { removeProjectMember } from "../../presentation/server-actions/remove-member";

export function useRemoveProjectMember() {
  return useServerMutation({
    mutationFn: removeProjectMember,
  });
}
