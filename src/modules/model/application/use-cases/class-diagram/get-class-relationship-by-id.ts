import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IClassDiagramRepository, FindClassRelationshipByIdQuery } from "../../ports/class-diagram";

export type GetClassRelationshipByIdUseCasePayload = {
  query: FindClassRelationshipByIdQuery;
  context: {
    token: string;
  };
};

export type GetClassRelationshipByIdUseCaseResponse = {
  id: string;
  modelId: string;
  layer: string;
  sourceElementId: string;
  targetElementId: string;
  name: string;
  description: string;
  relationshipType: string;
  aggregationKind: string;
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
} | null;

export class GetClassRelationshipByIdUseCase
  implements IUseCase<GetClassRelationshipByIdUseCasePayload, GetClassRelationshipByIdUseCaseResponse>
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    query,
  }: GetClassRelationshipByIdUseCasePayload): Promise<GetClassRelationshipByIdUseCaseResponse> {
    try {
      const relationship = await this.repository.findRelationshipById(query);
      return relationship ? relationship.toJSON() : null;
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error getting class relationship"),
      );
    }
  }
}