import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { updateElement } from "../../presentation/server-actions/update-element";

export function useUpdateElement() {
  return useServerMutation({
    mutationFn: updateElement,
  });
}
