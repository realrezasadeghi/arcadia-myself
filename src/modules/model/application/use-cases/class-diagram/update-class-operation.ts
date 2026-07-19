import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IClassDiagramRepository, UpdateClassOperationPayload } from "../../ports/class-diagram";

export type UpdateClassOperationUseCasePayload = {
  payload: UpdateClassOperationPayload;
  context: {
    token: string;
  };
};

export type UpdateClassOperationUseCaseResponse = {
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

export class UpdateClassOperationUseCase
  implements IUseCase<UpdateClassOperationUseCasePayload, UpdateClassOperationUseCaseResponse>
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: UpdateClassOperationUseCasePayload): Promise<UpdateClassOperationUseCaseResponse> {
    try {
      const existing = await this.repository.findOperationById({ id: payload.id });
      if (!existing) {
        throw new Error(`ClassOperation not found with id: ${payload.id}`);
      }
      return (await this.repository.updateOperation(payload)).toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error updating class operation"));
    }
  }
}