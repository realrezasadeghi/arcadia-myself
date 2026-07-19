import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  CreateClassOperationParameterPayload,
  IClassDiagramRepository,
} from "../../ports/class-diagram";

export type CreateClassOperationParameterUseCasePayload = {
  payload: CreateClassOperationParameterPayload;
  context: {
    token: string;
  };
};

export type CreateClassOperationParameterUseCaseResponse = {
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

export class CreateClassOperationParameterUseCase
  implements
    IUseCase<
      CreateClassOperationParameterUseCasePayload,
      CreateClassOperationParameterUseCaseResponse
    >
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: CreateClassOperationParameterUseCasePayload): Promise<CreateClassOperationParameterUseCaseResponse> {
    try {
      const parameter = await this.repository.createParameter(payload);
      return parameter.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error creating class operation parameter"),
      );
    }
  }
}
