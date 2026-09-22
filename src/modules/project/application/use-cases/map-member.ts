import type { ProjectPermission } from "../../domain/constants/permissions";
import { resolveAccess } from "../../domain/services/permissions";
import type { ProjectRoleName } from "../../domain/value-objects/project-role";

/** Raw member shape returned by the Capella API. */
export type RawProjectMember = {
  userId: number;
  name: string;
  username: string;
  role?: string;
  roles?: string[];
  permissions?: string[];
  joinedAt: string;
};

/** Normalize an API member into the multi-role frontend model. */
export function toProjectMemberData(raw: RawProjectMember): {
  userId: number;
  name: string;
  username: string;
  /** All roles held by the member (multi-role union model). */
  roles: ProjectRoleName[];
  /** Primary role for single-role display contexts (roles[0]). */
  role: ProjectRoleName;
  permissions: ProjectPermission[];
  joinedAt: string;
} {
  const access = resolveAccess({
    role: raw.role,
    roles: raw.roles,
    permissions: raw.permissions,
  });

  return {
    userId: raw.userId,
    name: raw.name,
    username: raw.username,
    roles: access.roles,
    role: access.roles[0],
    permissions: access.permissions,
    joinedAt: raw.joinedAt,
  };
}
