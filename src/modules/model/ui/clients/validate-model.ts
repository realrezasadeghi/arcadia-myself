import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { validateModel } from "../../presentation/server-actions/validate-model";

export const validateModelKey = (projectId: string) => [
  "validate-model",
  projectId,
];

export function useValidateModel(projectId: string) {
  return useServerQuery({
    enabled: !!projectId,
    queryKey: validateModelKey(projectId),
    queryFn: () => validateModel(projectId, []),
  });
}
