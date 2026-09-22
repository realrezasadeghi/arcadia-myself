import {
  isProjectRoleName,
  type ProjectRoleName,
} from "../../domain/value-objects/project-role";

export function validateProjectId(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }
  if (
    typeof value === "string" &&
    value.trim() !== "" &&
    !Number.isNaN(Number(value))
  ) {
    const num = Number(value);
    if (num > 0) return num;
  }
  throw new Error("Project id is not valid");
}

export function validateUserId(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }
  if (
    typeof value === "string" &&
    value.trim() !== "" &&
    !Number.isNaN(Number(value))
  ) {
    const num = Number(value);
    if (num > 0) return num;
  }
  throw new Error("Member user id is not valid");
}

export function validateRoles(value: unknown): ProjectRoleName[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("At least one role is required");
  }
  const roles: ProjectRoleName[] = [];
  for (const item of value) {
    if (!isProjectRoleName(item)) {
      throw new Error("Role is not valid");
    }
    if (!roles.includes(item)) {
      roles.push(item);
    }
  }
  return roles;
}
