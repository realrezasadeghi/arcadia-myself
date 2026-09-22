import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { ProjectRoleName } from "../../domain/value-objects/project-role";
import type {
  AddProjectMemberResponse,
  IProjectRepository,
} from "../ports/project";
import { toProjectMemberData } from "./map-member";

export type AddProjectMemberPayload = {
  payload: {
    projectId: number;
    username: string;
    roles: ProjectRoleName[];
  };
  context: { token: string };
};

export type AddProjectMemberUseCaseResponse = AddProjectMemberResponse;

export class AddProjectMemberUseCase
  implements IUseCase<AddProjectMemberPayload, AddProjectMemberUseCaseResponse>
{
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute({
    payload,
    context,
  }: AddProjectMemberPayload): Promise<AddProjectMemberUseCaseResponse> {
    try {
      const response = await this.projectRepository.addMember(
        payload,
        context.token,
      );
      return toProjectMemberData(response.data);
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in add project member"),
      );
    }
  }
}
