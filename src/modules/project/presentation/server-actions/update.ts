"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { extractUserIdFromJwt } from "@/modules/shared/libs/extract-jwt";
import { fail, ok } from "@/modules/shared/utils/response";
import { updateTag } from "next/cache";
import { UpdateProjectUseCase } from "../../application/use-cases/update";
import { projectRepository } from "../../infrastructure/repositories";
import { UpdateProjectDTO, type UpdateProjectDTOProps } from "../dtos/update";

export async function update(payload: UpdateProjectDTOProps) {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const userId = extractUserIdFromJwt(token);

    const dto = UpdateProjectDTO.create(payload);

    const updateProjectUseCase = new UpdateProjectUseCase(projectRepository);

    const response = await updateProjectUseCase.execute({
      payload: dto,
      context: {
        token,
        userId,
        requesterId: userId,
      },
    });

    updateTag("GET_ALL_PROJECTS");

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
