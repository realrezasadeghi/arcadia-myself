import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { updateClassElement } from "../../presentation/server-actions/update-class-element";

export function useUpdateClassElement() {
  return useServerMutation({
    mutationFn: updateClassElement,
  });
}
