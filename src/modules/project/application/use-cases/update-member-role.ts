import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { ProjectRoleName } from "../../domain/value-objects/project-role";
import type {
  IProjectRepository,
  UpdateProjectMemberRoleResponse,
} from "../ports/project";
import { toProjectMemberData } from "./map-member";

export type UpdateProjectMemberRolePayload = {
  payload: { projectId: number; userId: number; roles: ProjectRoleName[] };
  context: { token: string };
};

export type UpdateProjectMemberRoleUseCaseResponse =
  UpdateProjectMemberRoleResponse;

export class UpdateProjectMemberRoleUseCase
  implements
    IUseCase<
      UpdateProjectMemberRolePayload,
      UpdateProjectMemberRoleUseCaseResponse
    >
{
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute({
    payload,
    context,
  }: UpdateProjectMemberRolePayload): Promise<UpdateProjectMemberRoleUseCaseResponse> {
    try {
      const response = await this.projectRepository.updateMemberRole(
        payload,
        context.token,
      );
      return toProjectMemberData(response.data);
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in update project member role"),
      );
    }
  }
}
