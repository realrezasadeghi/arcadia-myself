"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import { RemoveProjectUseCase } from "../../application/use-cases/remove";
import { projectRepository } from "../../infrastructure/remote";

export const remove = withAuth(
  async (id: number, { token }) => {
    const removeProjectUseCase = new RemoveProjectUseCase(projectRepository);

    const response = await removeProjectUseCase.execute({
      payload: {
        id,
      },
      context: {
        token,
      },
    });

    return response;
  },
);
