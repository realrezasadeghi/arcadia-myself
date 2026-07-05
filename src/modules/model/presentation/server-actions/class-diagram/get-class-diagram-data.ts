"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import {
  type GetClassDiagramDataResponse,
  GetClassDiagramDataUseCase,
} from "../../../application/use-cases/class-diagram/get-data";
import { classDiagramRepository } from "../../../infrastructure/persistence/drizzle/repositories";

export async function getClassDiagramData(
  modelId: string,
): Promise<IRes<GetClassDiagramDataResponse>> {
  try {
    const token = await cookiesStorageService.get("token");
    if (!token) throw new Error("Token is required");

    if (!modelId) throw new Error("Model ID is required");

    const useCase = new GetClassDiagramDataUseCase(classDiagramRepository);

    const response = await useCase.execute({
      query: { modelId },
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
