import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IProjectRepository } from "../ports/project";
import { type ProjectView, toProjectView } from "./map-project";

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

export type CreateProjectResponse = ProjectView;

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

      // The creator becomes admin (server-enforced, mirrored by fallback).
      return toProjectView(response.data, context.userId);
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in create project"));
    }
  }
}
