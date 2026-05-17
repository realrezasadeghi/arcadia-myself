import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { updateTraceLink } from "../../presentation/server-actions/update-trace-link";

export function useUpdateTraceLink() {
  return useServerMutation({
    mutationFn: updateTraceLink,
  });
}
