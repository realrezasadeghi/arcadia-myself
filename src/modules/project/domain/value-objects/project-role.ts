/**
 * Predefined project roles exposed by the Capella API (`GET /api/project-roles`).
 *
 * A member may hold multiple roles (multi-role union model); the effective
 * permission set is the union of each role's permissions.
 */
export const PROJECT_ROLE_NAMES = [
  "project_viewer",
  "oa_viewer",
  "oa_editor",
  "sa_viewer",
  "sa_editor",
  "la_viewer",
  "la_editor",
  "pa_viewer",
  "pa_editor",
  "project_inviter",
  "admin",
] as const;

export type ProjectRoleName = (typeof PROJECT_ROLE_NAMES)[number];

const ROLE_NAME_SET: ReadonlySet<string> = new Set(PROJECT_ROLE_NAMES);

export function isProjectRoleName(value: unknown): value is ProjectRoleName {
  return typeof value === "string" && ROLE_NAME_SET.has(value);
}
