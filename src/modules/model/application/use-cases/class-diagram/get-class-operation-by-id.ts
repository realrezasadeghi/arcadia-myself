import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IClassDiagramRepository, FindClassOperationByIdQuery } from "../../ports/class-diagram";

export type GetClassOperationByIdUseCasePayload = {
  query: FindClassOperationByIdQuery;
  context: {
    token: string;
  };
};

export type GetClassOperationByIdUseCaseResponse = {
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
} | null;

export class GetClassOperationByIdUseCase
  implements IUseCase<GetClassOperationByIdUseCasePayload, GetClassOperationByIdUseCaseResponse>
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    query,
  }: GetClassOperationByIdUseCasePayload): Promise<GetClassOperationByIdUseCaseResponse> {
    try {
      const operation = await this.repository.findOperationById(query);
      return operation ? operation.toJSON() : null;
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error getting class operation"));
    }
  }
}