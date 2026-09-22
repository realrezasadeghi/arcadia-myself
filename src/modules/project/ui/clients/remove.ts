import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { remove } from "../../presentation/server-actions/remove";

export function useRemoveProject() {
  return useServerMutation({
    mutationFn: remove,
  });
}
