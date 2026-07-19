import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IClassDiagramRepository, RemoveClassOperationParameterPayload } from "../../ports/class-diagram";

export type RemoveClassOperationParameterUseCasePayload = {
  payload: RemoveClassOperationParameterPayload;
  context: {
    token: string;
  };
};

export type RemoveClassOperationParameterUseCaseResponse = boolean;

export class RemoveClassOperationParameterUseCase
  implements IUseCase<RemoveClassOperationParameterUseCasePayload, RemoveClassOperationParameterUseCaseResponse>
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: RemoveClassOperationParameterUseCasePayload): Promise<RemoveClassOperationParameterUseCaseResponse> {
    try {
      const existing = await this.repository.findParameterById({ id: payload.id });
      if (!existing) {
        throw new Error(`ClassOperationParameter not found with id: ${payload.id}`);
      }
      return await this.repository.removeParameter(payload);
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error removing class operation parameter"));
    }
  }
}