import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { addProjectMember } from "../../presentation/server-actions/add-member";

export function useAddProjectMember() {
  return useServerMutation({
    mutationFn: addProjectMember,
  });
}
