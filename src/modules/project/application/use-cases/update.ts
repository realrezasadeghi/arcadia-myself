import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import { can } from "../../domain/services/permissions";
import type { IProjectRepository } from "../ports/project";
import { type ProjectView, toProjectView } from "./map-project";

export type UpdateProjectPayload = {
  payload: {
    id: number;
    name?: string;
    description?: string;
  };
  context: {
    token: string;
    userId: number;
  };
};

export type UpdateProjectResponse = ProjectView;

export class UpdateProjectUseCase
  implements IUseCase<UpdateProjectPayload, UpdateProjectResponse>
{
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute({
    payload,
    context,
  }: UpdateProjectPayload): Promise<UpdateProjectResponse> {
    try {
      // Fetch the current project to merge mutable fields and to run the
      // UX-level permission guard (the backend remains the authority).
      const current = await this.projectRepository.getProjectById(
        { id: payload.id },
        context.token,
      );
      const currentView = toProjectView(current.data, context.userId);

      if (!can(currentView.permissions, "editProject")) {
        throw new Error("Your project role does not allow this action.");
      }

      const name = payload.name ?? currentView.name;
      const description = payload.description ?? currentView.description;

      const updated = await this.projectRepository.update(
        { id: payload.id, name, description },
        context.token,
      );

      return toProjectView(updated.data, context.userId);
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error updating project"));
    }
  }
}
