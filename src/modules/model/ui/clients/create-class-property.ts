import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { createClassProperty } from "../../presentation/server-actions/create-class-property";

export function useCreateClassProperty() {
  return useServerMutation({
    mutationFn: createClassProperty,
  });
}
