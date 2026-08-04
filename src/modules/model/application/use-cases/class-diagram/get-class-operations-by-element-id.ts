import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  IClassDiagramRepository,
  FindClassOperationsByElementIdQuery,
} from "../../ports/class-diagram";

export type GetClassOperationsByElementIdUseCasePayload = {
  query: FindClassOperationsByElementIdQuery;
  context: {
    token: string;
  };
};

export type GetClassOperationsByElementIdUseCaseResponse = {
  id: string;
  classElementId: string;
  modelId: string;
  layer: string;
  name: string;
  description: string;
  returnTypeClassElementId: string | null;
  returnTypeLiteral: string;
  returnMultiplicityLower: number;
  returnMultiplicityUpper: string;
  isStatic: boolean;
  isAbstract: boolean;
  isQuery: boolean;
  visibility: string;
  ordering: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}[];

export class GetClassOperationsByElementIdUseCase
  implements
    IUseCase<
      GetClassOperationsByElementIdUseCasePayload,
      GetClassOperationsByElementIdUseCaseResponse
    >
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    query,
  }: GetClassOperationsByElementIdUseCasePayload): Promise<GetClassOperationsByElementIdUseCaseResponse> {
    try {
      const operations = await this.repository.findOperationsByElementId(query);
      return operations.map((o) => o.toJSON());
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error getting class operations"),
      );
    }
  }
}
