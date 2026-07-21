import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getClassOperationsByElementId } from "../../presentation/server-actions/get-class-operations-by-element-id";

export function useClassOperationsByElementId(classElementId: string) {
  return useServerQuery({
    queryKey: ["class-operations", classElementId],
    queryFn: () => getClassOperationsByElementId(classElementId),
    enabled: !!classElementId,
  });
}
