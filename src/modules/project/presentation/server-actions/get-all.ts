"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { extractUserIdFromJwt } from "@/modules/shared/libs/extract-jwt";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { cacheTag } from "next/cache";
import {
  type GetAllProjectsResponse,
  GetAllProjectsUseCase,
} from "../../application/use-cases/get-all";
import { projectRepository } from "../../infrastructure/remote";

export async function getAllProjects(): Promise<IRes<GetAllProjectsResponse>> {
  "use cache: private";
  cacheTag("GET_ALL_PROJECTS");
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const userId = extractUserIdFromJwt(token);

    const getAllProjectsUseCase = new GetAllProjectsUseCase(projectRepository);

    const response = await getAllProjectsUseCase.execute({
      context: { token, userId },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
