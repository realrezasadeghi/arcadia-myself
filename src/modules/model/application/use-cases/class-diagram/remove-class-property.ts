import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IClassDiagramRepository, RemoveClassPropertyPayload } from "../../ports/class-diagram";

export type RemoveClassPropertyUseCasePayload = {
  payload: RemoveClassPropertyPayload;
  context: {
    token: string;
  };
};

export type RemoveClassPropertyUseCaseResponse = boolean;

export class RemoveClassPropertyUseCase
  implements IUseCase<RemoveClassPropertyUseCasePayload, RemoveClassPropertyUseCaseResponse>
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: RemoveClassPropertyUseCasePayload): Promise<RemoveClassPropertyUseCaseResponse> {
    try {
      const existing = await this.repository.findPropertyById({ id: payload.id });
      if (!existing) {
        throw new Error(`ClassProperty not found with id: ${payload.id}`);
      }
      return await this.repository.removeProperty(payload);
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error removing class property"));
    }
  }
}