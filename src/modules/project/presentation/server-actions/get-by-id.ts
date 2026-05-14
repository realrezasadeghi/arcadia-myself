"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { extractUserIdFromJwt } from "@/modules/shared/libs/extract-jwt";
import { fail, ok } from "@/modules/shared/utils/response";
import { cacheTag } from "next/cache";
import { GetProjectByIdUseCase } from "../../application/use-cases/get-by-id";
import { projectRepository } from "../../infrastructure/repositories";

export async function getProjectById(id: number) {
  "use cache: private";
  cacheTag("GET_PROJECT_BY_ID");
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const userId = extractUserIdFromJwt(token);

    const getProjectByIdUseCase = new GetProjectByIdUseCase(projectRepository);

    const response = await getProjectByIdUseCase.execute({
      query: { id },
      context: { token, userId },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
