"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { cacheTag } from "next/cache";
import {
  type GetModelsByProjectIdResponse,
  GetModelsByProjectIdUseCase,
} from "../../application/use-cases/get-models-by-project-id";
import { modelRepository } from "../../infrastructure/persistence/drizzle/repositories";

export async function getModelsByProjectId(
  projectId: string,
): Promise<IRes<GetModelsByProjectIdResponse[]>> {
  "use cache: private";
  cacheTag(`get-models-by-project-id-${projectId}`);
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required.");
    }

    if (!projectId) {
      throw new Error("Project id is required.");
    }

    const getModelsByProjectIdUseCase = new GetModelsByProjectIdUseCase(
      modelRepository,
    );

    const response = await getModelsByProjectIdUseCase.execute({
      query: { projectId },
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
