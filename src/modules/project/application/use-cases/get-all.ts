import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IProjectRepository } from "../ports/project";
import { type ProjectView, toProjectView } from "./map-project";

export type GetAllProjectsPayload = {
  context: {
    token: string;
    userId: number;
  };
};

export type GetAllProjectsResponse = ProjectView[];

export class GetAllProjectsUseCase
  implements IUseCase<GetAllProjectsPayload, GetAllProjectsResponse>
{
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute({
    context,
  }: GetAllProjectsPayload): Promise<GetAllProjectsResponse> {
    try {
      const response = await this.projectRepository.getAllProjects(
        context.token,
      );

      return response.data.map((rawProject) =>
        toProjectView(rawProject, context.userId),
      );
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in get all projects"));
    }
  }
}
