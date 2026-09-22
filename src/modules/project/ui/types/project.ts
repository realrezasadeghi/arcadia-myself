import type { ProjectPermission } from "../../domain/constants/permissions";
import type { ProjectRoleName } from "../../domain/value-objects/project-role";

/**
 * Frontend projection of a project for the requesting user.
 * Matches the `ProjectView` returned by the project use-cases.
 */
export type Project = {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  /** All roles held by the requesting user (multi-role union model). */
  roles: ProjectRoleName[];
  /** Primary role for single-role display contexts (roles[0]). */
  role: ProjectRoleName;
  permissions: ProjectPermission[];
};
