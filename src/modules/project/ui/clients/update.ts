import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { update } from "../../presentation/server-actions/update";

export function useUpdateProject() {
  return useServerMutation({
    mutationFn: update,
  });
}
