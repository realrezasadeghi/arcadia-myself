import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { removeTraceLink } from "../../presentation/server-actions/remove-trace-link";

export function useRemoveTraceLink() {
  return useServerMutation({
    mutationFn: removeTraceLink,
  });
}
