import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { removeClassOperation } from "../../presentation/server-actions/remove-class-operation";

export function useRemoveClassOperation() {
  return useServerMutation({
    mutationFn: ({ id }: { id: string }) => removeClassOperation(id),
  });
}
