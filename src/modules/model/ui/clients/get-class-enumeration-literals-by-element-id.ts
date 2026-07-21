import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getClassEnumerationLiteralsByElementId } from "../../presentation/server-actions/get-class-enumeration-literals-by-element-id";

export function useClassEnumerationLiteralsByElementId(classElementId: string) {
  return useServerQuery({
    queryKey: ["class-enumeration-literals", classElementId],
    queryFn: () => getClassEnumerationLiteralsByElementId(classElementId),
    enabled: !!classElementId,
  });
}
