import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IRelationshipRepository } from "../ports/relationship";

export type RemoveRelationshipPayload = {
  payload: {
    modelId: string;
    relationshipId: string;
  };
  context: {
    token: string;
  };
};

/**
 * DeleteRelationshipUseCase
 *
 * Business rules:
 * 1. رابطه باید در مدل وجود داشته باشد
 */
export class DeleteRelationshipUseCase
  implements IUseCase<RemoveRelationshipPayload, boolean>
{
  constructor(private readonly repository: IRelationshipRepository) {}

  async execute({ payload }: RemoveRelationshipPayload): Promise<boolean> {
    try {
      const relationships = await this.repository.findRelationshipsByModelId({
        modelId: payload.modelId,
      });

      const rel = relationships.find((r) => r.id === payload.relationshipId);

      if (!rel)
        throw new Error(
          `Relation not found with id : ${payload.relationshipId}`,
        );

      return this.repository.removeRelationship({ id: payload.relationshipId });
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in remove relationship"),
      );
    }
  }
}
