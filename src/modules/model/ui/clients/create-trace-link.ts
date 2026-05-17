import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { createTraceLink } from "../../presentation/server-actions/create-trace-link";

export function useCreateTraceLink() {
  return useServerMutation({
    mutationFn: createTraceLink,
  });
}
