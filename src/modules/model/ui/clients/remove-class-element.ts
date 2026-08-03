import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { removeClassElement } from "../../presentation/server-actions/remove-class-element";

type RemoveClassElementVariables = { id: string; modelId: string };

export function useRemoveClassElement() {
  return useServerMutation<boolean, RemoveClassElementVariables>({
    mutationFn: ({ id, modelId }) => removeClassElement({ id, modelId }),
  });
}
