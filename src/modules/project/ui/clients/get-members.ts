import { useQuery } from "@tanstack/react-query";
import { getProjectMembers } from "../../presentation/server-actions/get-members";

export function useProjectMembers(projectId: number) {
  return useQuery({
    queryKey: ["project-members", projectId],
    queryFn: () => getProjectMembers({ projectId }),
  });
}
