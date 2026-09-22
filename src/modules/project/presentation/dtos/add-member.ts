import type { ProjectRoleName } from "../../domain/value-objects/project-role";
import { validateProjectId, validateRoles } from "./validators";

export type AddProjectMemberDTOProps = {
  projectId: number;
  username: string;
  roles: ProjectRoleName[];
};

export class AddProjectMemberDTO {
  public readonly projectId: number;
  public readonly username: string;
  public readonly roles: ProjectRoleName[];

  private constructor(props: AddProjectMemberDTOProps) {
    this.projectId = props.projectId;
    this.username = props.username;
    this.roles = props.roles;
  }

  static create(props: Record<string, unknown>): AddProjectMemberDTO {
    return new AddProjectMemberDTO({
      projectId: validateProjectId(props.projectId),
      username: AddProjectMemberDTO.validateUsername(props.username),
      roles: validateRoles(props.roles),
    });
  }

  private static validateUsername(value: unknown): string {
    if (typeof value !== "string") {
      throw new Error("Username is required");
    }
    const trimmed = value.trim();
    if (!trimmed) {
      throw new Error("Username is required");
    }
    if (trimmed.length < 3 || trimmed.length > 30) {
      throw new Error("Username must be between 3 and 30 characters");
    }
    return trimmed;
  }
}
