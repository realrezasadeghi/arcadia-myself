import { useQuery } from "@tanstack/react-query";
import { getProjectRoles } from "../../presentation/server-actions/get-roles";

export function useProjectRoles() {
  return useQuery({
    queryKey: ["project-roles"],
    queryFn: getProjectRoles,
  });
}
