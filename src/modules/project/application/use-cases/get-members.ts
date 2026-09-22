import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  GetProjectMembersResponse,
  IProjectRepository,
} from "../ports/project";
import { toProjectMemberData } from "./map-member";

export type GetProjectMembersPayload = {
  query: { projectId: number };
  context: { token: string };
};

export type GetProjectMembersUseCaseResponse = GetProjectMembersResponse;

export class GetProjectMembersUseCase
  implements
    IUseCase<GetProjectMembersPayload, GetProjectMembersUseCaseResponse>
{
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute({
    query,
    context,
  }: GetProjectMembersPayload): Promise<GetProjectMembersUseCaseResponse> {
    try {
      const response = await this.projectRepository.getMembers(
        query,
        context.token,
      );
      return response.data.map(toProjectMemberData);
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in get project members"),
      );
    }
  }
}
