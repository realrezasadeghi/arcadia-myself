"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { updateTag } from "next/cache";
import {
  type RemoveClassRelationshipUseCaseResponse,
  RemoveClassRelationshipUseCase,
} from "../../application/use-cases/class-diagram/remove-class-relationship";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";

export async function removeClassRelationship(
  id: string,
  modelId: string,
): Promise<IRes<RemoveClassRelationshipUseCaseResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const useCase = new RemoveClassRelationshipUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: { id },
      context: { token },
    });

    updateTag(`get-class-relationships-by-model-id-${modelId}`);

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}