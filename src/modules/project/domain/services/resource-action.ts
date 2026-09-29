import type { ProjectPermission } from "../constants/permissions";
import { can } from "./permissions";

/**
 * The nouns the product reasons about when it decides whether to render a
 * control. Deliberately small — it is an alias over the flat permission
 * strings, not a second permission system.
 */
export type ProjectResource =
  | "project"
  | "member"
  | "model"
  | "diagram"
  | "element"
  | "trace";

/**
 * The verbs a control performs on a resource. `view` is always "may I see it",
 * everything else is "may I change it".
 */
export type ProjectAction = "view" | "create" | "edit" | "delete" | "manage";

/**
 * Flat API permission backing each (resource, action) pair.
 *
 * A pair that is absent has no single backing permission — layer-scoped work
 * (`model`/`diagram`/`element` create and edit) depends on the element's
 * layer and must go through `canViewLayer`/`canEditLayer` instead.
 * {@link permissionFor} returns `null` for those, so checks fail closed.
 */
const PERMISSION_FOR: Record<
  ProjectResource,
  Partial<Record<ProjectAction, ProjectPermission>>
> = {
  project: {
    view: "viewProject",
    edit: "editProject",
    delete: "deleteProject",
  },
  member: {
    view: "viewProject",
    create: "addMembers",
    manage: "manageMembers",
  },
  model: { view: "viewProject" },
  diagram: { view: "viewProject" },
  element: { view: "viewProject" },
  trace: { view: "viewProject" },
};

/** The flat permission behind a (resource, action) pair, or `null`. */
export function permissionFor(
  resource: ProjectResource,
  action: ProjectAction,
): ProjectPermission | null {
  return PERMISSION_FOR[resource][action] ?? null;
}

/**
 * `true` only when the pair resolves to a permission the caller holds.
 * Unmapped pairs (layer-scoped mutations) fail closed.
 */
export function canPerform(
  permissions: readonly string[],
  resource: ProjectResource,
  action: ProjectAction,
): boolean {
  const permission = permissionFor(resource, action);
  return permission === null ? false : can(permissions, permission);
}
