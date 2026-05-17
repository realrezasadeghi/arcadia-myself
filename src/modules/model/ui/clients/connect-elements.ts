import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { connectElements } from "../../presentation/server-actions/connect-elements";

export function useConnectElements() {
  return useServerMutation({
    mutationFn: connectElements,
  });
}
