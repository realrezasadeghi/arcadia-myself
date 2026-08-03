import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { createClassOperationParameter } from "../../presentation/server-actions/create-class-operation-parameter";

export function useCreateClassOperationParameter() {
  return useServerMutation({
    mutationFn: createClassOperationParameter,
  });
}
