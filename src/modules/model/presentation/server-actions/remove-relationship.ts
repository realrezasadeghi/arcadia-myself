"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import { RemoveRelationshipUseCase } from "../../application/use-cases/remove-relationship";
import { relationshipRepository } from "../../infrastructure/persistence/drizzle/repositories";

export type RemoveRelationshipPayload = {
  modelId: string;
  relationshipId: string;
};

export const removeRelationship = withAuth(
  async (payload: RemoveRelationshipPayload, { token }): Promise<boolean> => {
    if (!payload.modelId) {
      throw new Error("Model id is required");
    }

    if (!payload.relationshipId) {
      throw new Error("Relationship id is required");
    }

    const removeRelationshipUseCase = new RemoveRelationshipUseCase(
      relationshipRepository,
    );

    const response = await removeRelationshipUseCase.execute({
      payload: { modelId: payload.modelId, relationshipId: payload.relationshipId },
      context: { token },
    });

    return response;
  },
);
