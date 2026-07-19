"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { updateTag } from "next/cache";
import {
  type RemoveClassElementUseCaseResponse,
  RemoveClassElementUseCase,
} from "../../application/use-cases/class-diagram/remove-class-element";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";

export async function removeClassElement(
  id: string,
  modelId: string,
): Promise<IRes<RemoveClassElementUseCaseResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const useCase = new RemoveClassElementUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: { id },
      context: { token },
    });

    updateTag(`get-class-elements-by-model-id-${modelId}`);

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}