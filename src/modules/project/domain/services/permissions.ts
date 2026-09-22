import {
  editPermissionForLayer,
  isProjectPermission,
  type ProjectLayer,
  type ProjectPermission,
  type ProjectRoleDefinition,
  permissionsForRole,
  viewPermissionForLayer,
} from "../constants/permissions";
import {
  isProjectRoleName,
  type ProjectRoleName,
} from "../value-objects/project-role";

/**
 * Pure permission helpers. They operate on plain permission strings so they
 * stay decoupled from where the permissions come from (API response or the
 * local role-permission matrix).
 */
export function can(
  permissions: readonly string[],
  permission: ProjectPermission,
): boolean {
  return permissions.includes(permission);
}

export function canAny(
  permissions: readonly string[],
  anyOf: readonly ProjectPermission[],
): boolean {
  return anyOf.some((permission) => permissions.includes(permission));
}

export function canViewLayer(
  permissions: readonly string[],
  layer: ProjectLayer,
): boolean {
  return can(permissions, viewPermissionForLayer(layer));
}

export function canEditLayer(
  permissions: readonly string[],
  layer: ProjectLayer,
): boolean {
  return can(permissions, editPermissionForLayer(layer));
}

/**
 * Roles a member may assign: a role can be granted only when every permission
 * it carries is within the granter own permissions (inviter ceiling).
 */
export function filterAssignableRoles(
  myPermissions: readonly string[],
  roles: readonly ProjectRoleDefinition[],
): ProjectRoleDefinition[] {
  return roles.filter((definition) =>
    definition.permissions.every((permission) =>
      myPermissions.includes(permission),
    ),
  );
}

/** Pick the first valid role name from a candidate list. */
export function pickRole(
  candidates: readonly (string | null | undefined)[],
): ProjectRoleName | null {
  for (const candidate of candidates) {
    if (isProjectRoleName(candidate)) return candidate;
  }
  return null;
}

function normalizeRoles(
  roles: readonly string[] | null | undefined,
  role: string | null | undefined,
): ProjectRoleName[] {
  const seen = new Set<ProjectRoleName>();
  const result: ProjectRoleName[] = [];

  for (const candidate of roles ?? []) {
    if (isProjectRoleName(candidate) && !seen.has(candidate)) {
      seen.add(candidate);
      result.push(candidate);
    }
  }

  if (isProjectRoleName(role) && !seen.has(role)) {
    seen.add(role);
    result.push(role);
  }

  return result;
}

function permissionsFromRoles(
  roles: readonly ProjectRoleName[],
): ProjectPermission[] {
  const union = new Set<ProjectPermission>();
  for (const role of roles) {
    for (const permission of permissionsForRole(role)) {
      union.add(permission);
    }
  }
  return [...union];
}

export type ResolveAccessInput = {
  userId?: number | null;
  created_by?: number | null;
  role?: string | null;
  roles?: readonly string[] | null;
  /** Absent/null → derive from roles via matrix. Present (even []) → authoritative. */
  permissions?: readonly string[] | null;
};

export type ProjectAccess = {
  /** All roles held by the requesting user / member (union model). */
  roles: ProjectRoleName[];
  /** Effective permission set (API wins when the field is present). */
  permissions: ProjectPermission[];
};

/**
 * Single access resolver for project and member payloads.
 *
 * Rules (fail-closed):
 * 1. `roles[]` (plus legacy scalar `role`) determine the role set.
 * 2. When no role data is present: creator → admin, others → project_viewer.
 * 3. When `permissions` is present (including `[]`), it is authoritative —
 *    empty means no permissions (fail-closed).
 * 4. When `permissions` is absent, permissions are the matrix union of the
 *    resolved roles.
 */
export function resolveAccess(input: ResolveAccessInput): ProjectAccess {
  let roles = normalizeRoles(input.roles, input.role);

  if (roles.length === 0) {
    const isProjectContext = input.userId != null || input.created_by != null;
    if (isProjectContext && input.userId != null && input.created_by != null) {
      roles = [input.created_by === input.userId ? "admin" : "project_viewer"];
    } else {
      roles = ["project_viewer"];
    }
  }

  const permissions: ProjectPermission[] =
    input.permissions != null
      ? input.permissions.filter(
          (permission): permission is ProjectPermission =>
            isProjectPermission(permission),
        )
      : permissionsFromRoles(roles);

  return { roles, permissions };
}
