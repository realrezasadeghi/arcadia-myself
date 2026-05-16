"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { cacheTag } from "next/cache";
import {
  type GetDiagramsByModelIdResponse,
  GetDiagramsByModelUseCase,
} from "../../application/use-cases/get-diagrams-by-model-id";
import {
  diagramRepository,
  modelRepository,
} from "../../infrastructure/persistence/drizzle/repositories";

export async function getDiagramsByModelId(
  modelId: string,
): Promise<IRes<GetDiagramsByModelIdResponse[]>> {
  "use cache: private";
  cacheTag(`get-diagrams-by-model-id-${modelId}`);
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    if (!modelId) {
      throw new Error("Model id is required.");
    }

    const getDiagramsByModelIdUseCase = new GetDiagramsByModelUseCase(
      diagramRepository,
      modelRepository,
    );

    const response = await getDiagramsByModelIdUseCase.execute({
      query: { modelId },
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
