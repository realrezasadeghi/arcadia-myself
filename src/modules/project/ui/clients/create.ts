import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { create } from "../../presentation/server-actions/create";

export function useCreateProject() {
  return useServerMutation({
    mutationFn: create,
  });
}
