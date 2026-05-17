"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { RemoveElementUseCase } from "../../application/use-cases/remove-element";
import { elementRepository } from "../../infrastructure/persistence/drizzle/repositories";

export async function removeElement(id: string): Promise<IRes<boolean>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    if (!id) {
      throw new Error("Element id is required");
    }

    const removeElementUseCase = new RemoveElementUseCase(elementRepository);

    const response = await removeElementUseCase.execute({
      payload: { id },
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
