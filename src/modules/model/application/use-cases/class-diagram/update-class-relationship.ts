import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IClassDiagramRepository, UpdateClassRelationshipPayload } from "../../ports/class-diagram";

export type UpdateClassRelationshipUseCasePayload = {
  payload: UpdateClassRelationshipPayload;
  context: {
    token: string;
  };
};

export type UpdateClassRelationshipUseCaseResponse = {
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
};

export class UpdateClassRelationshipUseCase
  implements IUseCase<UpdateClassRelationshipUseCasePayload, UpdateClassRelationshipUseCaseResponse>
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: UpdateClassRelationshipUseCasePayload): Promise<UpdateClassRelationshipUseCaseResponse> {
    try {
      const relationship = await this.repository.updateRelationship(payload);
      return relationship.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error updating class relationship"),
      );
    }
  }
}