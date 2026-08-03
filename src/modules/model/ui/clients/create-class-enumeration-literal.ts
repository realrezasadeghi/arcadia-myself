import { useServerMutation } from "@/modules/shared/ui/hooks/use-mutation";
import { createClassEnumerationLiteral } from "../../presentation/server-actions/create-class-enumeration-literal";

export function useCreateClassEnumerationLiteral() {
  return useServerMutation({
    mutationFn: createClassEnumerationLiteral,
  });
}
