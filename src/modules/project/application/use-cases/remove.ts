// remove-project.use-case.ts
import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IProjectRepository } from "../ports/project";

export type RemoveProjectPayload = {
  payload: {
    id: number;
  };
  context: {
    token: string;
  };
};

export class RemoveProjectUseCase
  implements IUseCase<RemoveProjectPayload, boolean>
{
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute({ payload, context }: RemoveProjectPayload): Promise<boolean> {
    try {
      const response = await this.projectRepository.remove(
        payload,
        context.token,
      );
      return response.success;
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error removing project"));
    }
  }
}
