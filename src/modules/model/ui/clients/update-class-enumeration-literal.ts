import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { updateClassEnumerationLiteral } from "../../presentation/server-actions/update-class-enumeration-literal";

export function useUpdateClassEnumerationLiteral() {
  return useServerMutation({
    mutationFn: updateClassEnumerationLiteral,
  });
}
