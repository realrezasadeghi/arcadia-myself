"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { cacheTag } from "next/cache";
import {
  GetClassDiagramsByModelIdUseCase,
  type GetClassDiagramsByModelIdUseCaseResponse,
} from "../../application/use-cases/class-diagram/get-class-diagrams-by-model-id";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";

export async function getClassDiagramsByModelId(
  modelId: string,
): Promise<IRes<GetClassDiagramsByModelIdUseCaseResponse>> {
  "use cache: private";
  cacheTag(`get-class-diagrams-by-model-id-${modelId}`);
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const useCase = new GetClassDiagramsByModelIdUseCase(
      classDiagramRepository,
    );

    const response = await useCase.execute({
      query: { modelId },
      context: { token },
    });

    console.log("response", response);

    return ok(response);
  } catch (error) {
    console.log("error", error);
    return fail(error);
  }
}
