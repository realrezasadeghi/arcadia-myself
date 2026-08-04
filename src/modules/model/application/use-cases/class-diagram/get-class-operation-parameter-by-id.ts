import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  IClassDiagramRepository,
  FindClassElementByIdQuery,
} from "../../ports/class-diagram";

export type GetClassOperationParameterByIdUseCasePayload = {
  query: FindClassElementByIdQuery;
  context: {
    token: string;
  };
};

export type GetClassOperationParameterByIdUseCaseResponse = {
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
} | null;

export class GetClassOperationParameterByIdUseCase
  implements
    IUseCase<
      GetClassOperationParameterByIdUseCasePayload,
      GetClassOperationParameterByIdUseCaseResponse
    >
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    query,
  }: GetClassOperationParameterByIdUseCasePayload): Promise<GetClassOperationParameterByIdUseCaseResponse> {
    try {
      const parameter = await this.repository.findParameterById(query);
      return parameter ? parameter.toJSON() : null;
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error getting class operation parameter"),
      );
    }
  }
}
