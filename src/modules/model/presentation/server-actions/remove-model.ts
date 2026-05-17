"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { RemoveModelUseCase } from "../../application/use-cases/remove-model";
import { modelRepository } from "../../infrastructure/persistence/drizzle/repositories";

export async function removeModel(id: string): Promise<IRes<boolean>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    if (!id) {
      throw new Error("Model id is required");
    }

    const removeModelUseCase = new RemoveModelUseCase(modelRepository);

    const response = await removeModelUseCase.execute({
      payload: { id },
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
