"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { updateTag } from "next/cache";
import {
  type GetClassElementsByModelIdUseCaseResponse,
  GetClassElementsByModelIdUseCase,
} from "../../application/use-cases/class-diagram/get-class-elements-by-model-id";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";

export async function getClassElementsByModelId(
  modelId: string,
  layer?: string,
): Promise<IRes<GetClassElementsByModelIdUseCaseResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const useCase = new GetClassElementsByModelIdUseCase(classDiagramRepository);

    const response = await useCase.execute({
      query: { modelId, layer },
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}