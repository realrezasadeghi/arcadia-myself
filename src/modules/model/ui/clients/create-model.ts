import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { createModel } from "../../presentation/server-actions/create-model";

export function useCreateModel() {
  return useServerMutation({
    mutationFn: createModel,
  });
}
