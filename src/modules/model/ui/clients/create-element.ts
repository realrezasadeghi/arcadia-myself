import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { createElement } from "../../presentation/server-actions/create-element";

export function useCreateElement() {
  return useServerMutation({
    mutationFn: createElement,
  });
}
