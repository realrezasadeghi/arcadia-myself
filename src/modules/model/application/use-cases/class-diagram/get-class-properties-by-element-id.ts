import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IClassDiagramRepository, FindClassPropertiesByElementIdQuery } from "../../ports/class-diagram";

export type GetClassPropertiesByElementIdUseCasePayload = {
  query: FindClassPropertiesByElementIdQuery;
  context: {
    token: string;
  };
};

export type GetClassPropertiesByElementIdUseCaseResponse = {
  id: string;
  classElementId: string;
  modelId: string;
  layer: string;
  name: string;
  description: string;
  typeClassElementId: string | null;
  typeLiteral: string;
  isStatic: boolean;
  isReadOnly: boolean;
  isDerived: boolean;
  isID: boolean;
  visibility: string;
  multiplicityLower: number;
  multiplicityUpper: string;
  isOrdered: boolean;
  isUnique: boolean;
  collectionKind: string;
  aggregationKind: string;
  defaultValue: string;
  ordering: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}[];

export class GetClassPropertiesByElementIdUseCase
  implements IUseCase<GetClassPropertiesByElementIdUseCasePayload, GetClassPropertiesByElementIdUseCaseResponse>
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    query,
  }: GetClassPropertiesByElementIdUseCasePayload): Promise<GetClassPropertiesByElementIdUseCaseResponse> {
    try {
      const properties = await this.repository.findPropertiesByElementId(query);
      return properties.map((p) => p.toJSON());
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error getting class properties"),
      );
    }
  }
}
