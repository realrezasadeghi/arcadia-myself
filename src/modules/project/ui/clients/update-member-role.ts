import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { updateProjectMemberRole } from "../../presentation/server-actions/update-member-role";

export function useUpdateProjectMemberRole() {
  return useServerMutation({
    mutationFn: updateProjectMemberRole,
  });
}
