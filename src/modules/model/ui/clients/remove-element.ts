import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { removeElement } from "../../presentation/server-actions/remove-element";

export function useRemoveElement() {
  return useServerMutation({
    mutationFn: removeElement,
  });
}
