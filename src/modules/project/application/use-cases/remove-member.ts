import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IProjectRepository } from "../ports/project";

export type RemoveProjectMemberPayload = {
  payload: { projectId: number; userId: number };
  context: { token: string };
};

export type RemoveProjectMemberUseCaseResponse = boolean;

export class RemoveProjectMemberUseCase
  implements
    IUseCase<RemoveProjectMemberPayload, RemoveProjectMemberUseCaseResponse>
{
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute({
    payload,
    context,
  }: RemoveProjectMemberPayload): Promise<RemoveProjectMemberUseCaseResponse> {
    try {
      const response = await this.projectRepository.removeMember(
        payload,
        context.token,
      );
      return response.success;
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in remove project member"),
      );
    }
  }
}
