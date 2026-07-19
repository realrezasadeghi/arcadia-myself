import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IClassDiagramRepository, RemoveClassOperationPayload } from "../../ports/class-diagram";

export type RemoveClassOperationUseCasePayload = {
  payload: RemoveClassOperationPayload;
  context: {
    token: string;
  };
};

export type RemoveClassOperationUseCaseResponse = boolean;

export class RemoveClassOperationUseCase
  implements IUseCase<RemoveClassOperationUseCasePayload, RemoveClassOperationUseCaseResponse>
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: RemoveClassOperationUseCasePayload): Promise<RemoveClassOperationUseCaseResponse> {
    try {
      const existing = await this.repository.findOperationById({ id: payload.id });
      if (!existing) {
        throw new Error(`ClassOperation not found with id: ${payload.id}`);
      }
      return await this.repository.removeOperation(payload);
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error removing class operation"));
    }
  }
}