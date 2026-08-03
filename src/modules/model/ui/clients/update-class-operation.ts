import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { updateClassOperation } from "../../presentation/server-actions/update-class-operation";

export function useUpdateClassOperation() {
  return useServerMutation({
    mutationFn: updateClassOperation,
  });
}
