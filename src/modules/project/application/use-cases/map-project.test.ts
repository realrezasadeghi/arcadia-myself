import { describe, expect, it } from "vitest";
import type { Project } from "../../application/ports/project";
import { toProjectView } from "./map-project";

function rawProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 1,
    name: "Team project",
    description: "Private project",
    created_by: 1,
    created_at: "2026-09-12T12:00:00.000000Z",
    updated_at: "2026-09-12T12:00:00.000000Z",
    ...overrides,
  };
}

describe("toProjectView", () => {
  it("projects the API payload with the requesting user access", () => {
    const view = toProjectView(
      rawProject({
        role: "oa_editor",
        permissions: ["viewProject", "viewOA", "editOA"],
      }),
      2,
    );

    expect(view).toMatchObject({
      id: 1,
      name: "Team project",
      createdBy: 1,
      roles: ["oa_editor"],
      role: "oa_editor",
      permissions: ["viewProject", "viewOA", "editOA"],
    });
  });

  it("keeps every role from the roles array", () => {
    const view = toProjectView(
      rawProject({ role: "owner", roles: ["project_inviter", "oa_editor"] }),
      2,
    );

    expect(view.roles).toEqual(["project_inviter", "oa_editor"]);
    expect(view.role).toBe("project_inviter");
    expect(view.permissions).toEqual(
      expect.arrayContaining(["viewProject", "addMembers", "editOA"]),
    );
  });

  it("treats an explicit empty permissions array as fail-closed", () => {
    const view = toProjectView(
      rawProject({ roles: ["admin"], permissions: [] }),
      2,
    );

    expect(view.roles).toEqual(["admin"]);
    expect(view.permissions).toEqual([]);
  });

  it("treats the creator as admin when the API omits the role", () => {
    const view = toProjectView(rawProject(), 1);

    expect(view.roles).toEqual(["admin"]);
    expect(view.role).toBe("admin");
    expect(view.permissions).toContain("deleteProject");
  });

  it("treats a non-creator without role data as project_viewer", () => {
    const view = toProjectView(rawProject(), 99);

    expect(view.roles).toEqual(["project_viewer"]);
    expect(view.role).toBe("project_viewer");
    expect(view.permissions).toEqual(["viewProject"]);
  });
});
