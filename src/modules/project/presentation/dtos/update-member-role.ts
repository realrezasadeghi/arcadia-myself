import type { ProjectRoleName } from "../../domain/value-objects/project-role";
import { validateProjectId, validateRoles, validateUserId } from "./validators";

export type UpdateProjectMemberRoleDTOProps = {
  projectId: number;
  userId: number;
  roles: ProjectRoleName[];
};

export class UpdateProjectMemberRoleDTO {
  public readonly projectId: number;
  public readonly userId: number;
  public readonly roles: ProjectRoleName[];

  private constructor(props: UpdateProjectMemberRoleDTOProps) {
    this.projectId = props.projectId;
    this.userId = props.userId;
    this.roles = props.roles;
  }

  static create(props: Record<string, unknown>): UpdateProjectMemberRoleDTO {
    return new UpdateProjectMemberRoleDTO({
      projectId: validateProjectId(props.projectId),
      userId: validateUserId(props.userId),
      roles: validateRoles(props.roles),
    });
  }
}
