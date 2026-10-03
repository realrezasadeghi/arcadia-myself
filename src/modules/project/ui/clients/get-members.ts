import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import type { ProjectMemberData } from "../../application/ports/project";
import { getProjectMembers } from "../../presentation/server-actions/get-members";

export function useProjectMembers(
  projectId: number,
  initialData?: ProjectMemberData[],
) {
  return useServerQuery<ProjectMemberData[]>({
    queryKey: ["project-members", projectId],
    queryFn: () => getProjectMembers({ projectId }),
    initialData,
  });
}
