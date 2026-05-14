import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import {
  Project,
  type ProjectMember,
  type ProjectRole,
} from "../../domain/entities/project";
import type { IProjectRepository } from "../ports/project";

export type CreateProjectPayload = {
  payload: {
    name: string;
    description?: string;
  };
  context: {
    token: string;
    userId: number;
  };
};

export type CreateProjectResponse = {
  id: number;
  name: string;
  description?: string;
  members: { userId: number; role: ProjectRole; joinedAt: string }[];
  ownerId: number;
  createdAt: string;
  updatedAt: string;
};

export class CreateProjectUseCase
  implements IUseCase<CreateProjectPayload, CreateProjectResponse>
{
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute({
    payload,
    context,
  }: CreateProjectPayload): Promise<CreateProjectResponse> {
    try {
      const response = await this.projectRepository.create(
        payload,
        context.token,
      );

      const ownerId = context.userId;

      const members: ProjectMember[] = [
        { userId: ownerId, role: "OWNER", joinedAt: new Date() },
      ];

      const project = Project.reconstitute({
        id: response.data.id,
        name: response.data.name,
        ownerId: ownerId,
        members,
        description: response.data.description,
        updatedAt: response.data.updated_at.toString(),
        createdAt: response.data.created_at.toString(),
      });

      return project.toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in create project"));
    }
  }
}
