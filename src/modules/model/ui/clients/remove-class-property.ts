import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { removeClassProperty } from "../../presentation/server-actions/remove-class-property";

export function useRemoveClassProperty() {
  return useServerMutation({
    mutationFn: ({ id }: { id: string }) => removeClassProperty(id),
  });
}
