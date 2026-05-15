"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { cacheTag } from "next/cache";
import {
  type GetModelByIdResponse,
  GetModelByIdUseCase,
} from "../../application/use-cases/get-model-by-id";
import { modelRepository } from "../../infrastructure/persistence/drizzle/repositories";

export async function getModelById(
  id: string,
): Promise<IRes<GetModelByIdResponse>> {
  "use cache: private";
  cacheTag("GET_MODEL_BY_ID", id);
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    if (!id) {
      throw new Error("Model id is required.");
    }

    const getModelByIdUseCase = new GetModelByIdUseCase(modelRepository);

    const response = await getModelByIdUseCase.execute({
      query: { id },
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
