import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import { Project, type ProjectRole } from "../../domain/entities/project";
import type { IProjectRepository } from "../ports/project";

export type GetAllProjectsPayload = {
  context: {
    token: string;
    userId: number;
  };
};

export type GetAllProjectsResponse = {
  id: number;
  name: string;
  description?: string;
  members: { userId: number; role: ProjectRole; joinedAt: string }[];
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}[];

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

      const projects = response.data.map((rawProject) => {
        const project = Project.reconstitute({
          id: rawProject.id,
          name: rawProject.name,
          ownerId: context.userId,
          members: [
            { role: "OWNER", joinedAt: new Date(), userId: context.userId },
          ],
          description: rawProject.description,
          createdAt: new Date(rawProject.created_at).toISOString(),
          updatedAt: new Date(rawProject.updated_at).toISOString(),
        });
        return project.toJSON();
      });

      return projects;
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in get all projects"));
    }
  }
}
