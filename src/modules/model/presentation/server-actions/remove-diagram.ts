"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { RemoveDiagramUseCase } from "../../application/use-cases/remove-diagram";
import { diagramRepository } from "../../infrastructure/persistence/drizzle/repositories";

export async function removeDiagram(id: string): Promise<IRes<boolean>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    if (!id) {
      throw new Error("Diagram id is required");
    }

    const removeDiagramUseCase = new RemoveDiagramUseCase(diagramRepository);

    const response = await removeDiagramUseCase.execute({
      payload: { id },
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
