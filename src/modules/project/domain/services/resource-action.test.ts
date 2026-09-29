import { describe, expect, it } from "vitest";
import { canPerform, permissionFor } from "./resource-action";

const ADMIN = [
  "viewProject",
  "editProject",
  "deleteProject",
  "addMembers",
  "manageMembers",
  "viewOA",
  "editOA",
];

const INVITER = ["viewProject", "addMembers"];

const VIEWER = ["viewProject"];

describe("permissionFor", () => {
  it("maps project actions onto the flat API permissions", () => {
    expect(permissionFor("project", "view")).toBe("viewProject");
    expect(permissionFor("project", "edit")).toBe("editProject");
    expect(permissionFor("project", "delete")).toBe("deleteProject");
  });

  it("maps member actions onto the flat API permissions", () => {
    expect(permissionFor("member", "view")).toBe("viewProject");
    expect(permissionFor("member", "create")).toBe("addMembers");
    expect(permissionFor("member", "manage")).toBe("manageMembers");
  });

  it("exposes view for layer-scoped resources", () => {
    expect(permissionFor("model", "view")).toBe("viewProject");
    expect(permissionFor("diagram", "view")).toBe("viewProject");
    expect(permissionFor("element", "view")).toBe("viewProject");
    expect(permissionFor("trace", "view")).toBe("viewProject");
  });

  it("returns null for layer-scoped mutations", () => {
    expect(permissionFor("model", "create")).toBeNull();
    expect(permissionFor("model", "edit")).toBeNull();
    expect(permissionFor("diagram", "create")).toBeNull();
    expect(permissionFor("element", "edit")).toBeNull();
    expect(permissionFor("trace", "create")).toBeNull();
    expect(permissionFor("trace", "delete")).toBeNull();
  });
});

describe("canPerform", () => {
  it("grants what the permissions include", () => {
    expect(canPerform(ADMIN, "project", "edit")).toBe(true);
    expect(canPerform(ADMIN, "member", "manage")).toBe(true);
    expect(canPerform(INVITER, "member", "create")).toBe(true);
  });

  it("denies what the permissions exclude", () => {
    expect(canPerform(VIEWER, "project", "edit")).toBe(false);
    expect(canPerform(VIEWER, "member", "create")).toBe(false);
    expect(canPerform(INVITER, "member", "manage")).toBe(false);
    expect(canPerform(INVITER, "project", "delete")).toBe(false);
  });

  it("fails closed for unmapped layer-scoped mutations", () => {
    expect(canPerform(ADMIN, "model", "create")).toBe(false);
    expect(canPerform(ADMIN, "element", "edit")).toBe(false);
    expect(canPerform(ADMIN, "trace", "create")).toBe(false);
  });

  it("fails closed with no permissions at all", () => {
    expect(canPerform([], "project", "view")).toBe(false);
    expect(canPerform([], "member", "manage")).toBe(false);
  });
});
