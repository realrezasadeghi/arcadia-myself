import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import { Project, type ProjectRole } from "../../domain/entities/project";
import type { IProjectRepository } from "../ports/project";

export type UpdateProjectPayload = {
  payload: {
    id: number;
    name?: string;
    description?: string;
  };
  context: {
    token: string;
    userId: number;
    requesterId: number;
  };
};

export type UpdateProjectResponse = {
  id: number;
  name: string;
  description?: string;
  members: { userId: number; role: ProjectRole; joinedAt: string }[];
  ownerId: number;
  createdAt: string;
  updatedAt: string;
};

export class UpdateProjectUseCase
  implements IUseCase<UpdateProjectPayload, UpdateProjectResponse>
{
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute({
    payload,
    context,
  }: UpdateProjectPayload): Promise<UpdateProjectResponse> {
    try {
      const { data } = await this.projectRepository.getProjectById(
        { id: payload.id },
        context.token,
      );

      const project = Project.reconstitute({
        id: data.id,
        name: data.name,
        description: data.description,
        ownerId: context.userId,
        members: [
          { userId: context.userId, role: "OWNER", joinedAt: new Date() },
        ],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      });

      if (!project.isOwner(context.requesterId)) {
        throw new Error("Only project owner can change details of project.");
      }

      if (payload.name) {
        project.rename(payload.name);
      }

      if (payload.description) {
        project.updateDescription(payload.description);
      }

      const updated = await this.projectRepository.update(
        {
          id: payload.id,
          name: project.name.value,
          description: project.description,
        },
        context.token,
      );

      return Project.reconstitute({
        id: updated.data.id,
        name: updated.data.name,
        description: updated.data.description,
        ownerId: context.userId,
        members: [
          { userId: context.userId, role: "OWNER", joinedAt: new Date() },
        ],
        createdAt: updated.data.created_at,
        updatedAt: updated.data.updated_at,
      }).toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error updating project"));
    }
  }
}
