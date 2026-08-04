import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { removeClassOperationParameter } from "../../presentation/server-actions/remove-class-operation-parameter";

export function useRemoveClassOperationParameter() {
  return useServerMutation({
    mutationFn: removeClassOperationParameter,
  });
}
