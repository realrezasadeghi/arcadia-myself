import { describe, expect, it } from "vitest";
import { toProjectMemberData } from "./map-member";

describe("toProjectMemberData", () => {
  it("normalizes a member payload into the multi-role model", () => {
    const member = toProjectMemberData({
      userId: 2,
      name: "Teammate",
      username: "teammate",
      role: "editor",
      roles: ["oa_editor"],
      permissions: ["viewProject", "viewOA", "editOA"],
      joinedAt: "2026-09-12 12:00:00",
    });

    expect(member).toEqual({
      userId: 2,
      name: "Teammate",
      username: "teammate",
      roles: ["oa_editor"],
      role: "oa_editor",
      permissions: ["viewProject", "viewOA", "editOA"],
      joinedAt: "2026-09-12 12:00:00",
    });
  });

  it("keeps every role from roles[]", () => {
    const member = toProjectMemberData({
      userId: 2,
      name: "Teammate",
      username: "teammate",
      roles: ["oa_editor", "sa_viewer", "project_inviter"],
      joinedAt: "2026-09-12 12:00:00",
    });

    expect(member.roles).toEqual(["oa_editor", "sa_viewer", "project_inviter"]);
    expect(member.role).toBe("oa_editor");
    expect(member.permissions).toEqual(
      expect.arrayContaining([
        "viewProject",
        "viewOA",
        "editOA",
        "viewSA",
        "addMembers",
      ]),
    );
  });

  it("derives the permissions from the role when the API omits them", () => {
    const member = toProjectMemberData({
      userId: 1,
      name: "Project creator",
      username: "owner",
      role: "admin",
      joinedAt: "2026-09-12 12:00:00",
    });

    expect(member.roles).toEqual(["admin"]);
    expect(member.role).toBe("admin");
    expect(member.permissions).toContain("manageMembers");
  });

  it("treats an explicit empty permissions array as fail-closed", () => {
    const member = toProjectMemberData({
      userId: 1,
      name: "Restricted",
      username: "restricted",
      roles: ["admin"],
      permissions: [],
      joinedAt: "2026-09-12 12:00:00",
    });

    expect(member.permissions).toEqual([]);
  });

  it("degrades legacy roles to project_viewer", () => {
    const member = toProjectMemberData({
      userId: 3,
      name: "Legacy",
      username: "legacy",
      role: "VIEWER",
      joinedAt: "2026-09-12 12:00:00",
    });

    expect(member.roles).toEqual(["project_viewer"]);
    expect(member.role).toBe("project_viewer");
    expect(member.permissions).toEqual(["viewProject"]);
  });
});
