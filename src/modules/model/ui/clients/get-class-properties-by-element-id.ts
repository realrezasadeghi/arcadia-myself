import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getClassPropertiesByElementId } from "../../presentation/server-actions/get-class-properties-by-element-id";

export function useClassPropertiesByElementId(classElementId: string) {
  return useServerQuery({
    queryKey: ["class-properties", classElementId],
    queryFn: () => getClassPropertiesByElementId(classElementId),
    enabled: !!classElementId,
  });
}
