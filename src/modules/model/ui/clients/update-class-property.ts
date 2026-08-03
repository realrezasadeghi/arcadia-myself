import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { updateClassProperty } from "../../presentation/server-actions/update-class-property";

export function useUpdateClassProperty() {
  return useServerMutation({
    mutationFn: updateClassProperty,
  });
}
