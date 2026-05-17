import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { updateModel } from "../../presentation/server-actions/update-model";

export function useUpdateModel() {
  return useServerMutation({
    mutationFn: updateModel,
  });
}
