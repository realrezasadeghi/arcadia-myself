import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { createClassOperation } from "../../presentation/server-actions/create-class-operation";

export function useCreateClassOperation() {
  return useServerMutation({
    mutationFn: createClassOperation,
  });
}
