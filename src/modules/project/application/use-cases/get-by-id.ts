import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IProjectRepository } from "../ports/project";
import { type ProjectView, toProjectView } from "./map-project";

export type GetProjectByIdPayload = {
  query: {
    id: number;
  };
  context: {
    token: string;
    userId: number;
  };
};

export type GetProjectByIdResponse = ProjectView;

export class GetProjectByIdUseCase
  implements IUseCase<GetProjectByIdPayload, GetProjectByIdResponse>
{
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute({
    query,
    context,
  }: GetProjectByIdPayload): Promise<GetProjectByIdResponse> {
    try {
      const response = await this.projectRepository.getProjectById(
        query,
        context.token,
      );

      return toProjectView(response.data, context.userId);
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, `Error in get project by id ${query.id}`),
      );
    }
  }
}
