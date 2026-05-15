import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import { Project, type ProjectRole } from "../../domain/entities/project";
import type { IProjectRepository } from "../ports/project";

export type GetProjectByIdPayload = {
  query: {
    id: number;
  };
  context: {
    token: string;
    userId: number;
  };
};

export type GetProjectByIdResponse = {
  id: number;
  name: string;
  description?: string;
  members: { userId: number; role: ProjectRole; joinedAt: string }[];
  ownerId: number;
  createdAt: string;
  updatedAt: string;
};

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

      const project = Project.reconstitute({
        id: response.data.id,
        name: response.data.name,
        ownerId: context.userId,
        members: [
          { userId: context.userId, role: "OWNER", joinedAt: new Date() },
        ],
        description: response.data.description,
        createdAt: new Date(response.data.created_at).toISOString(),
        updatedAt: new Date(response.data.updated_at).toISOString(),
      });

      return project.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, `Error in get project by id ${query.id}`),
      );
    }
  }
}
