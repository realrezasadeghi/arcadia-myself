import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IClassDiagramRepository, FindClassEnumerationLiteralsByElementIdQuery } from "../../ports/class-diagram";

export type GetClassEnumerationLiteralsByElementIdUseCasePayload = {
  query: FindClassEnumerationLiteralsByElementIdQuery;
  context: {
    token: string;
  };
};

export type GetClassEnumerationLiteralsByElementIdUseCaseResponse = {
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
}[];

export class GetClassEnumerationLiteralsByElementIdUseCase
  implements IUseCase<GetClassEnumerationLiteralsByElementIdUseCasePayload, GetClassEnumerationLiteralsByElementIdUseCaseResponse>
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    query,
  }: GetClassEnumerationLiteralsByElementIdUseCasePayload): Promise<GetClassEnumerationLiteralsByElementIdUseCaseResponse> {
    try {
      const literals = await this.repository.findEnumerationLiteralsByElementId(query);
      return literals.map((l) => l.toJSON());
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error getting class enumeration literals"),
      );
    }
  }
}
