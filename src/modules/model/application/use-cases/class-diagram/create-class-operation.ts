import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IClassDiagramRepository, CreateClassOperationPayload } from "../../ports/class-diagram";

export type CreateClassOperationUseCasePayload = {
  payload: CreateClassOperationPayload;
  context: {
    token: string;
  };
};

export type CreateClassOperationUseCaseResponse = {
  id: string;
  classElementId: string;
  modelId: string;
  layer: string;
  name: string;
  returnTypeClassElementId: string | null;
  returnTypeLiteral: string;
  isStatic: boolean;
  isAbstract: boolean;
  visibility: string;
  ordering: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export class CreateClassOperationUseCase
  implements IUseCase<CreateClassOperationUseCasePayload, CreateClassOperationUseCaseResponse>
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: CreateClassOperationUseCasePayload): Promise<CreateClassOperationUseCaseResponse> {
    try {
      const operation = await this.repository.createOperation(payload);
      return operation.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error creating class operation"),
      );
    }
  }
}