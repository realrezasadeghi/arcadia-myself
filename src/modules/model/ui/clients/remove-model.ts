import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { removeModel } from "../../presentation/server-actions/remove-model";

export function useRemoveModel() {
  return useServerMutation({
    mutationFn: removeModel,
  });
}
