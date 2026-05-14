"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, ok } from "@/modules/shared/utils/response";
import { updateTag } from "next/cache";
import { RemoveProjectUseCase } from "../../application/use-cases/remove";
import { projectRepository } from "../../infrastructure/repositories";

export async function remove(id: number) {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const removeProjectUseCase = new RemoveProjectUseCase(projectRepository);

    const response = await removeProjectUseCase.execute({
      payload: {
        id,
      },
      context: {
        token,
      },
    });

    updateTag("GET_ALL_PROJECTS");

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
