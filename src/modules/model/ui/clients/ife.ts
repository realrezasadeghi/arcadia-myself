import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { seedIFE } from "../../presentation/server-actions/ife";

export function useIFEProject() {
  return useServerMutation({
    mutationFn: seedIFE,
  });
}
