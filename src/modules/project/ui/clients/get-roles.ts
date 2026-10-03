import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import type { ProjectRoleDefinition } from "../../domain/constants/permissions";
import { getProjectRoles } from "../../presentation/server-actions/get-roles";

export function useProjectRoles(initialData?: ProjectRoleDefinition[]) {
  return useServerQuery<ProjectRoleDefinition[]>({
    queryKey: ["project-roles"],
    queryFn: () => getProjectRoles(),
    initialData,
  });
}
