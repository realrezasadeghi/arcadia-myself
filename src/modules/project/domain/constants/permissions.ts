import type { ProjectRoleName } from "../value-objects/project-role";

/**
 * Granular project permissions exposed by the Capella API.
 * Mirrors `GET /api/project-roles` / docs/project-permissions.md.
 */
export const PROJECT_PERMISSIONS = [
  "viewProject",
  "viewOA",
  "editOA",
  "viewSA",
  "editSA",
  "viewLA",
  "editLA",
  "viewPA",
  "editPA",
  "addMembers",
  "manageMembers",
  "editProject",
  "delete",
  "deleteProject",
] as const;

export type ProjectPermission = (typeof PROJECT_PERMISSIONS)[number];

const PERMISSION_SET: ReadonlySet<string> = new Set(PROJECT_PERMISSIONS);

export function isProjectPermission(
  value: unknown,
): value is ProjectPermission {
  return typeof value === "string" && PERMISSION_SET.has(value);
}

/** ARCADIA layers governed by their own view/edit permissions. */
export const PROJECT_LAYERS = ["OA", "SA", "LA", "PA"] as const;
export type ProjectLayer = (typeof PROJECT_LAYERS)[number];

const PROJECT_LAYER_SET: ReadonlySet<string> = new Set(PROJECT_LAYERS);

/**
 * Narrows any UI layer value (e.g. the legacy `EPBS`) to an RBAC-governed
 * layer. Legacy layers are not part of the Capella permission model.
 */
export function isProjectLayer(value: unknown): value is ProjectLayer {
  return typeof value === "string" && PROJECT_LAYER_SET.has(value);
}

const VIEW_PERMISSION_BY_LAYER: Record<ProjectLayer, ProjectPermission> = {
  OA: "viewOA",
  SA: "viewSA",
  LA: "viewLA",
  PA: "viewPA",
};

const EDIT_PERMISSION_BY_LAYER: Record<ProjectLayer, ProjectPermission> = {
  OA: "editOA",
  SA: "editSA",
  LA: "editLA",
  PA: "editPA",
};

export function viewPermissionForLayer(layer: ProjectLayer): ProjectPermission {
  return VIEW_PERMISSION_BY_LAYER[layer];
}

export function editPermissionForLayer(layer: ProjectLayer): ProjectPermission {
  return EDIT_PERMISSION_BY_LAYER[layer];
}

/** A role definition as returned by `GET /api/project-roles`. */
export type ProjectRoleDefinition = {
  role: ProjectRoleName;
  permissions: readonly ProjectPermission[];
};

/**
 * Role → permission matrix (fallback only).
 * The API-provided `permissions[]` always wins when the field is present —
 * including an explicit empty array (fail-closed). The matrix is only used
 * when `permissions` is absent, as the union of the resolved roles.
 */
export const ROLE_PERMISSION_MATRIX: Record<
  ProjectRoleName,
  readonly ProjectPermission[]
> = {
  project_viewer: ["viewProject"],
  oa_viewer: ["viewProject", "viewOA"],
  oa_editor: ["viewProject", "viewOA", "editOA"],
  sa_viewer: ["viewProject", "viewSA"],
  sa_editor: ["viewProject", "viewSA", "editSA"],
  la_viewer: ["viewProject", "viewLA"],
  la_editor: ["viewProject", "viewLA", "editLA"],
  pa_viewer: ["viewProject", "viewPA"],
  pa_editor: ["viewProject", "viewPA", "editPA"],
  project_inviter: ["viewProject", "addMembers"],
  admin: [
    "viewProject",
    "viewOA",
    "editOA",
    "viewSA",
    "editSA",
    "viewLA",
    "editLA",
    "viewPA",
    "editPA",
    "addMembers",
    "manageMembers",
    "editProject",
    "delete",
    "deleteProject",
  ],
};

export function permissionsForRole(role: ProjectRoleName): ProjectPermission[] {
  return [...ROLE_PERMISSION_MATRIX[role]];
}
