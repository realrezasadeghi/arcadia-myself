import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { transitionLayer } from "../../presentation/server-actions/transition-layer";

export function useTransitionLayer() {
  return useServerMutation({
    mutationFn: transitionLayer,
  });
}
