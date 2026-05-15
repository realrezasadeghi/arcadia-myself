import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { RelationshipProperties } from "../../domain/entities/relationship";
import type { IRelationshipRepository } from "../ports/relationship";

export type UpdateRelationshipPayload = {
  payload: {
    relationshipId: string;
    modelId: string;
    name?: string;
    description?: string;
    properties?: RelationshipProperties;
  };
  context: {
    token: string;
  };
};

export type UpdateRelationshipResponse = {
  id: string;
  modelId: string;
  name: string;
  description?: string;
  sourceElementId: string;
  targetElementId: string;
  type: string;
  updatedAt: string;
  createdAt: string;
  properties: RelationshipProperties;
};

/**
 * UpdateRelationshipUseCase
 *
 * Business rules:
 * 1. رابطه باید وجود داشته باشد
 * 2. نوع رابطه قابل تغییر نیست (بعد از ایجاد ثابت است)
 */
export class UpdateRelationshipUseCase {
  constructor(
    private readonly relationshipRepository: IRelationshipRepository,
  ) {}

  async execute({
    payload,
  }: UpdateRelationshipPayload): Promise<UpdateRelationshipResponse> {
    try {
      const relationships =
        await this.relationshipRepository.findRelationshipsByModelId({
          modelId: payload.modelId,
        });

      const relationship = relationships.find(
        (r) => r.id === payload.relationshipId,
      );

      if (!relationship)
        throw new Error(
          `Relationship not found with id : ${payload.relationshipId}`,
        );

      relationship.rename(payload.name);

      relationship.updateDescription(payload.description);

      relationship.updateProperties({ ...payload.properties });

      const response = await this.relationshipRepository.updateRelationship({
        modelId: payload.modelId,
        id: payload.relationshipId,
        name: relationship.name,
        description: relationship.description,
        properties: relationship.properties,
      });

      return response.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in update relationship"),
      );
    }
  }
}
