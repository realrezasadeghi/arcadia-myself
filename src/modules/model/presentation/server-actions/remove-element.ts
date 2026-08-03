"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import { RemoveElementUseCase } from "../../application/use-cases/remove-element";
import { elementRepository } from "../../infrastructure/persistence/drizzle/repositories";

export const removeElement = withAuth(
  async (id: string, { token }): Promise<boolean> => {
    if (!id) {
      throw new Error("Element id is required");
    }

    const removeElementUseCase = new RemoveElementUseCase(elementRepository);

    const response = await removeElementUseCase.execute({
      payload: { id },
      context: { token },
    });

    return response;
  },
);
