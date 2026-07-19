import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IClassDiagramRepository, FindClassRelationshipsByModelIdQuery } from "../../ports/class-diagram";

export type GetClassRelationshipsByModelIdUseCasePayload = {
  query: FindClassRelationshipsByModelIdQuery;
  context: {
    token: string;
  };
};

export type GetClassRelationshipsByModelIdUseCaseResponse = {
  id: string;
  modelId: string;
  layer: string;
  sourceElementId: string;
  targetElementId: string;
  name: string;
  relationshipType: string;
  isAggregate: boolean;
  isComposite: boolean;
  sourceMultiplicityLower: number;
  sourceMultiplicityUpper: string;
  targetMultiplicityLower: number;
  targetMultiplicityUpper: string;
  sourceRole: string;
  targetRole: string;
  isNavigableSource: boolean;
  isNavigableTarget: boolean;
  status: string;
  extensionProperties: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}[];

export class GetClassRelationshipsByModelIdUseCase
  implements IUseCase<GetClassRelationshipsByModelIdUseCasePayload, GetClassRelationshipsByModelIdUseCaseResponse>
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    query,
  }: GetClassRelationshipsByModelIdUseCasePayload): Promise<GetClassRelationshipsByModelIdUseCaseResponse> {
    try {
      const relationships = await this.repository.findRelationshipsByModelId(query);
      return relationships.map((r) => r.toJSON());
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error getting class relationships"),
      );
    }
  }
}