"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { RemoveRelationshipUseCase } from "../../application/use-cases/remove-relationship";
import { relationshipRepository } from "../../infrastructure/persistence/drizzle/repositories";

export async function removeRelationship({
  modelId,
  relationshipId,
}: {
  modelId: string;
  relationshipId: string;
}): Promise<IRes<boolean>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    if (!modelId) {
      throw new Error("Model id is required");
    }

    if (!relationshipId) {
      throw new Error("Relationship id is required");
    }

    const removeRelationshipUseCase = new RemoveRelationshipUseCase(
      relationshipRepository,
    );

    const response = await removeRelationshipUseCase.execute({
      payload: { modelId, relationshipId },
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
