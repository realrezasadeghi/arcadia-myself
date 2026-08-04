import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  IClassDiagramRepository,
  UpdateClassOperationParameterPayload,
} from "../../ports/class-diagram";

export type UpdateClassOperationParameterUseCasePayload = {
  payload: UpdateClassOperationParameterPayload;
  context: {
    token: string;
  };
};

export type UpdateClassOperationParameterUseCaseResponse = {
  id: string;
  classOperationId: string;
  modelId: string;
  layer: string;
  name: string;
  typeClassElementId: string | null;
  typeLiteral?: string;
  multiplicityLower: number;
  multiplicityUpper: string;
  defaultValue: string | null;
  isOrdered: boolean;
  isUnique: boolean;
  ordering: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export class UpdateClassOperationParameterUseCase
  implements
    IUseCase<
      UpdateClassOperationParameterUseCasePayload,
      UpdateClassOperationParameterUseCaseResponse
    >
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: UpdateClassOperationParameterUseCasePayload): Promise<UpdateClassOperationParameterUseCaseResponse> {
    try {
      const existing = await this.repository.findParameterById({
        id: payload.id,
      });
      if (!existing) {
        throw new Error(
          `ClassOperationParameter not found with id: ${payload.id}`,
        );
      }
      return (await this.repository.updateParameter(payload)).toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error updating class operation parameter"),
      );
    }
  }
}
