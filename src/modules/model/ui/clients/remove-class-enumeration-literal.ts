import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { removeClassEnumerationLiteral } from "../../presentation/server-actions/remove-class-enumeration-literal";

export function useRemoveClassEnumerationLiteral() {
  return useServerMutation({
    mutationFn: ({ id }: { id: string }) => removeClassEnumerationLiteral(id),
  });
}
