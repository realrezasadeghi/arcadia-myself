import { describe, expect, it } from "vitest";
import {
  editPermissionForLayer,
  isProjectLayer,
  isProjectPermission,
  PROJECT_LAYERS,
  PROJECT_PERMISSIONS,
  permissionsForRole,
  ROLE_PERMISSION_MATRIX,
  viewPermissionForLayer,
} from "../constants/permissions";
import { PROJECT_ROLE_NAMES } from "../value-objects/project-role";
import {
  can,
  canAny,
  canEditLayer,
  canViewLayer,
  filterAssignableRoles,
  pickRole,
  resolveAccess,
} from "./permissions";

describe("permission catalogue", () => {
  it("exposes the 14 Capella permissions", () => {
    expect(PROJECT_PERMISSIONS).toHaveLength(14);
    expect(PROJECT_PERMISSIONS).toContain("viewProject");
    expect(PROJECT_PERMISSIONS).toContain("deleteProject");
  });

  it("guards unknown permission strings", () => {
    expect(isProjectPermission("viewOA")).toBe(true);
    expect(isProjectPermission("view")).toBe(false);
    expect(isProjectPermission(null)).toBe(false);
  });

  it("guards RBAC-governed layers only", () => {
    for (const layer of PROJECT_LAYERS) {
      expect(isProjectLayer(layer)).toBe(true);
    }
    expect(isProjectLayer("EPBS")).toBe(false);
    expect(isProjectLayer("oa")).toBe(false);
  });

  it("maps layers to their view/edit permission", () => {
    expect(viewPermissionForLayer("OA")).toBe("viewOA");
    expect(editPermissionForLayer("OA")).toBe("editOA");
    expect(viewPermissionForLayer("PA")).toBe("viewPA");
    expect(editPermissionForLayer("PA")).toBe("editPA");
  });
});

describe("role → permission matrix", () => {
  it("defines a permission set for every predefined role", () => {
    for (const role of PROJECT_ROLE_NAMES) {
      expect(ROLE_PERMISSION_MATRIX[role]).toBeDefined();
      expect(ROLE_PERMISSION_MATRIX[role].length).toBeGreaterThan(0);
    }
  });

  it("only references known permissions", () => {
    for (const role of PROJECT_ROLE_NAMES) {
      for (const permission of ROLE_PERMISSION_MATRIX[role]) {
        expect(isProjectPermission(permission)).toBe(true);
      }
    }
  });

  it("grants the expected permissions to layer roles", () => {
    expect(permissionsForRole("oa_editor")).toEqual([
      "viewProject",
      "viewOA",
      "editOA",
    ]);
    expect(permissionsForRole("pa_viewer")).toEqual(["viewProject", "viewPA"]);
    expect(permissionsForRole("project_inviter")).toEqual([
      "viewProject",
      "addMembers",
    ]);
  });

  it("keeps admin as the only role holding project-wide mutations", () => {
    const privilegedRoles = PROJECT_ROLE_NAMES.filter((role) => {
      const permissions = ROLE_PERMISSION_MATRIX[role];
      return (
        permissions.includes("editProject") ||
        permissions.includes("manageMembers") ||
        permissions.includes("deleteProject")
      );
    });

    expect(privilegedRoles).toEqual(["admin"]);
    expect(permissionsForRole("admin")).toHaveLength(
      PROJECT_PERMISSIONS.length,
    );
  });

  it("returns a copy so callers cannot mutate the matrix", () => {
    const permissions = permissionsForRole("admin");
    permissions.push("nope" as never);

    expect(ROLE_PERMISSION_MATRIX.admin).not.toContain("nope");
  });
});

describe("can / canAny / layer checks", () => {
  const oaEditor = permissionsForRole("oa_editor");

  it("checks a single permission within the set", () => {
    expect(can(oaEditor, "editOA")).toBe(true);
    expect(can(oaEditor, "editSA")).toBe(false);
  });

  it("checks whether any permission matches", () => {
    expect(canAny(oaEditor, ["editSA", "editOA"])).toBe(true);
    expect(canAny(oaEditor, ["editSA", "editPA"])).toBe(false);
    expect(canAny([], ["viewProject"])).toBe(false);
  });

  it("scopes view/edit checks per layer", () => {
    expect(canViewLayer(oaEditor, "OA")).toBe(true);
    expect(canEditLayer(oaEditor, "OA")).toBe(true);
    expect(canViewLayer(oaEditor, "SA")).toBe(false);
    expect(canEditLayer(oaEditor, "SA")).toBe(false);
  });

  it("denies every layer to a project-only viewer", () => {
    const viewer = permissionsForRole("project_viewer");

    for (const layer of PROJECT_LAYERS) {
      expect(canViewLayer(viewer, layer)).toBe(false);
      expect(canEditLayer(viewer, layer)).toBe(false);
    }
    expect(can(viewer, "viewProject")).toBe(true);
  });
});

describe("filterAssignableRoles (inviter ceiling)", () => {
  const definitions = PROJECT_ROLE_NAMES.map((role) => ({
    role,
    permissions: permissionsForRole(role),
  }));

  it("lets an admin assign every role", () => {
    const assignable = filterAssignableRoles(
      permissionsForRole("admin"),
      definitions,
    );

    expect(assignable).toHaveLength(PROJECT_ROLE_NAMES.length);
  });

  it("lets a project_inviter assign only roles within its own permission set", () => {
    const assignable = filterAssignableRoles(
      permissionsForRole("project_inviter"),
      definitions,
    ).map((definition) => definition.role);

    expect(assignable).toEqual(["project_viewer", "project_inviter"]);
  });

  it("stops an oa_editor from granting permissions it does not hold", () => {
    const assignable = filterAssignableRoles(
      permissionsForRole("oa_editor"),
      definitions,
    ).map((definition) => definition.role);

    expect(assignable).toContain("oa_editor");
    expect(assignable).toContain("oa_viewer");
    expect(assignable).not.toContain("admin");
    expect(assignable).not.toContain("project_inviter");
    expect(assignable).not.toContain("sa_editor");
  });

  it("returns nothing when the caller holds no permission", () => {
    expect(filterAssignableRoles([], definitions)).toEqual([]);
  });
});

describe("pickRole", () => {
  it("takes the first valid candidate", () => {
    expect(pickRole(["owner", "oa_editor"])).toBe("oa_editor");
    expect(pickRole([null, undefined, "admin"])).toBe("admin");
  });

  it("returns null when nothing is recognised", () => {
    expect(pickRole(["OWNER", "viewer"])).toBeNull();
    expect(pickRole([])).toBeNull();
  });
});

describe("resolveAccess", () => {
  it("prefers the API permissions over the matrix", () => {
    const access = resolveAccess({
      userId: 2,
      role: "project_viewer",
      permissions: ["viewProject", "viewOA"],
    });

    expect(access.roles).toEqual(["project_viewer"]);
    expect(access.permissions).toEqual(["viewProject", "viewOA"]);
  });

  it("keeps every role from roles[] and unions matrix permissions when permissions are absent", () => {
    const access = resolveAccess({
      userId: 2,
      roles: ["oa_editor", "sa_viewer", "project_inviter"],
    });

    expect(access.roles).toEqual(["oa_editor", "sa_viewer", "project_inviter"]);
    expect(access.permissions).toEqual(
      expect.arrayContaining([
        "viewProject",
        "viewOA",
        "editOA",
        "viewSA",
        "addMembers",
      ]),
    );
    expect(access.permissions).not.toContain("editSA");
  });

  it("includes the legacy scalar role alongside roles[]", () => {
    const access = resolveAccess({
      userId: 2,
      role: "oa_editor",
      roles: ["project_inviter"],
    });

    expect(access.roles).toEqual(["project_inviter", "oa_editor"]);
  });

  it("treats an explicit empty permissions array as fail-closed", () => {
    const access = resolveAccess({
      userId: 2,
      roles: ["admin"],
      permissions: [],
    });

    expect(access.roles).toEqual(["admin"]);
    expect(access.permissions).toEqual([]);
  });

  it("drops unknown permission strings coming from the API", () => {
    const access = resolveAccess({
      userId: 2,
      roles: ["oa_editor"],
      permissions: ["viewProject", "edit", "manageMembers"],
    });

    expect(access.permissions).toEqual(["viewProject", "manageMembers"]);
  });

  it("defaults the creator to admin when role data is absent", () => {
    const access = resolveAccess({ userId: 7, created_by: 7 });

    expect(access.roles).toEqual(["admin"]);
    expect(access.permissions).toHaveLength(PROJECT_PERMISSIONS.length);
  });

  it("defaults anyone else to project_viewer when role data is absent", () => {
    const access = resolveAccess({ userId: 7, created_by: 1 });

    expect(access.roles).toEqual(["project_viewer"]);
    expect(access.permissions).toEqual(["viewProject"]);
  });

  it("degrades unknown member roles to project_viewer", () => {
    const access = resolveAccess({ roles: ["EDITOR"], role: "VIEWER" });

    expect(access.roles).toEqual(["project_viewer"]);
    expect(access.permissions).toEqual(["viewProject"]);
  });

  it("keeps API permissions when they are valid for members", () => {
    const access = resolveAccess({
      roles: ["project_viewer"],
      permissions: ["viewProject", "addMembers"],
    });

    expect(access.permissions).toEqual(["viewProject", "addMembers"]);
  });
});
