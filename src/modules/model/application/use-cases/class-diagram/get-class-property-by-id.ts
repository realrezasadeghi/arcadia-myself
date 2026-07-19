import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IClassDiagramRepository, FindClassPropertyByIdQuery } from "../../ports/class-diagram";

export type GetClassPropertyByIdUseCasePayload = {
  query: FindClassPropertyByIdQuery;
  context: {
    token: string;
  };
};

export type GetClassPropertyByIdUseCaseResponse = {
  id: string;
  classElementId: string;
  modelId: string;
  layer: string;
  name: string;
  typeClassElementId: string | null;
  typeLiteral: string;
  isStatic: boolean;
  isReadOnly: boolean;
  visibility: string;
  multiplicityLower: number;
  multiplicityUpper: string;
  collectionKind: string;
  defaultValue: string;
  ordering: number;
  status: string;
  createdAt: string;
  updatedAt: string;
} | null;

export class GetClassPropertyByIdUseCase
  implements IUseCase<GetClassPropertyByIdUseCasePayload, GetClassPropertyByIdUseCaseResponse>
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    query,
  }: GetClassPropertyByIdUseCasePayload): Promise<GetClassPropertyByIdUseCaseResponse> {
    try {
      const property = await this.repository.findPropertyById(query);
      return property ? property.toJSON() : null;
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error getting class property"));
    }
  }
}