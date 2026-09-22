import type { Project } from "../../application/ports/project";
import type { ProjectPermission } from "../../domain/constants/permissions";
import { resolveAccess } from "../../domain/services/permissions";
import type { ProjectRoleName } from "../../domain/value-objects/project-role";

/**
 * The frontend projection of a project for the requesting user.
 * Replaces the legacy OWNER/EDITOR/VIEWER member projection.
 */
export type ProjectView = {
  id: number;
  name: string;
  description?: string;
  createdBy: number;
  /** All roles held by the requesting user (multi-role union model). */
  roles: ProjectRoleName[];
  /** Primary role for single-role display contexts (roles[0]). */
  role: ProjectRoleName;
  permissions: ProjectPermission[];
  createdAt: string;
  updatedAt: string;
};

export function toProjectView(raw: Project, userId: number): ProjectView {
  const access = resolveAccess({
    userId,
    role: raw.role,
    roles: raw.roles,
    permissions: raw.permissions,
    created_by: raw.created_by,
  });

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    createdBy: raw.created_by ?? userId,
    roles: access.roles,
    role: access.roles[0],
    permissions: access.permissions,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}
