import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { updateClassOperationParameter } from "../../presentation/server-actions/update-class-operation-parameter";

export function useUpdateClassOperationParameter() {
  return useServerMutation({
    mutationFn: updateClassOperationParameter,
  });
}
