import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  GetProjectRolesResponse,
  IProjectRepository,
} from "../ports/project";

export type GetProjectRolesPayload = {
  context: { token: string };
};

export type GetProjectRolesUseCaseResponse = GetProjectRolesResponse;

export class GetProjectRolesUseCase
  implements IUseCase<GetProjectRolesPayload, GetProjectRolesUseCaseResponse>
{
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(
    _payload: GetProjectRolesPayload,
  ): Promise<GetProjectRolesUseCaseResponse> {
    try {
      const response = await this.projectRepository.getRoles(
        _payload.context.token,
      );
      return response.data;
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in get project roles"));
    }
  }
}
