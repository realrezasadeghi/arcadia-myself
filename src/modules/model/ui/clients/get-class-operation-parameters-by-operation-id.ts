import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getClassOperationParametersByOperationId } from "../../presentation/server-actions/get-class-operation-parameters-by-operation-id";

export function useClassOperationParametersByOperationId(classOperationId: string) {
  return useServerQuery({
    queryKey: ["class-operation-parameters", classOperationId],
    queryFn: () => getClassOperationParametersByOperationId(classOperationId),
    enabled: !!classOperationId,
  });
}
