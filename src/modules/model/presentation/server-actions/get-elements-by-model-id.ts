"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { cacheLife, cacheTag } from "next/cache";
import {
  type GetElementsByModelIdResponse,
  GetElementsByModelIdUseCase,
} from "../../application/use-cases/get-elements-by-model-id";
import {
  elementRepository,
  modelRepository,
} from "../../infrastructure/persistence/drizzle/repositories";

export async function getElementsByModelId(
  modelId: string,
): Promise<IRes<GetElementsByModelIdResponse[]>> {
  "use cache: private";
  cacheTag(`get-elements-by-model-id-${modelId}`);
  cacheLife("minutes");
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    if (!modelId) {
      throw new Error("Model id is required.");
    }

    const getElementsByModelIdUseCase = new GetElementsByModelIdUseCase(
      modelRepository,
      elementRepository,
    );

    const response = await getElementsByModelIdUseCase.execute({
      query: { modelId },
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
