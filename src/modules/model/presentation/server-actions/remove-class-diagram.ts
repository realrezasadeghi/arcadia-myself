"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { updateTag } from "next/cache";
import {
  type RemoveClassDiagramUseCaseResponse,
  RemoveClassDiagramUseCase,
} from "../../application/use-cases/class-diagram/remove-class-diagram";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";

export async function removeClassDiagram(
  id: string,
  modelId: string,
): Promise<IRes<RemoveClassDiagramUseCaseResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const useCase = new RemoveClassDiagramUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: { id },
      context: { token },
    });

    updateTag(`get-class-diagrams-by-model-id-${modelId}`);

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}