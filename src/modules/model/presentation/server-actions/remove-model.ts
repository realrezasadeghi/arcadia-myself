"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import { RemoveModelUseCase } from "../../application/use-cases/remove-model";
import { modelRepository } from "../../infrastructure/persistence/drizzle/repositories";

export const removeModel = withAuth(
  async (id: string, { token }): Promise<boolean> => {
    if (!id) {
      throw new Error("Model id is required");
    }

    const removeModelUseCase = new RemoveModelUseCase(modelRepository);

    const response = await removeModelUseCase.execute({
      payload: { id },
      context: { token },
    });

    return response;
  },
);
