import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IClassDiagramRepository, FindClassElementByIdQuery } from "../../ports/class-diagram";

export type GetClassEnumerationLiteralByIdUseCasePayload = {
  query: FindClassElementByIdQuery;
  context: {
    token: string;
  };
};

export type GetClassEnumerationLiteralByIdUseCaseResponse = {
  id: string;
  classElementId: string;
  modelId: string;
  layer: string;
  name: string;
  value: string;
  ordering: number;
  status: string;
  createdAt: string;
  updatedAt: string;
} | null;

export class GetClassEnumerationLiteralByIdUseCase
  implements IUseCase<GetClassEnumerationLiteralByIdUseCasePayload, GetClassEnumerationLiteralByIdUseCaseResponse>
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    query,
  }: GetClassEnumerationLiteralByIdUseCasePayload): Promise<GetClassEnumerationLiteralByIdUseCaseResponse> {
    try {
      const literal = await this.repository.findEnumerationLiteralById(query);
      return literal ? literal.toJSON() : null;
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error getting class enumeration literal"));
    }
  }
}