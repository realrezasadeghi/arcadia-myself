import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { createClassElement } from "../../presentation/server-actions/create-class-element";

export function useCreateClassElement() {
  return useServerMutation({
    mutationFn: createClassElement,
  });
}
