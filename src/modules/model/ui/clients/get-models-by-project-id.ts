import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getModelsByProjectId } from "../../presentation/server-actions/get-models-by-project-id";

export const getModelsByProjectIdKey = (projectId: string) => [
  "get-models-by-project-id",
  projectId,
];

export function useGetModelsByProjectId(projectId: string) {
  return useServerQuery({
    enabled: !!projectId,
    queryKey: getModelsByProjectIdKey(projectId),
    queryFn: () => getModelsByProjectId(projectId),
  });
}
