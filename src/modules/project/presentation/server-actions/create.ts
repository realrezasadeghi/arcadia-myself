"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { extractUserIdFromJwt } from "@/modules/shared/libs/extract-jwt";
import { fail, ok } from "@/modules/shared/utils/response";
import { updateTag } from "next/cache";
import { CreateProjectUseCase } from "../../application/use-cases/create";
import { projectRepository } from "../../infrastructure/remote";
import { CreateProjectDTO, type CreateProjectDTOProps } from "../dtos/create";

export async function create(payload: CreateProjectDTOProps) {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const userId = extractUserIdFromJwt(token);

    const dto = CreateProjectDTO.create(payload);

    const createProjectUseCase = new CreateProjectUseCase(projectRepository);

    const response = await createProjectUseCase.execute({
      payload: dto,
      context: {
        token,
        userId,
      },
    });

    updateTag("GET_ALL_PROJECTS");

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
