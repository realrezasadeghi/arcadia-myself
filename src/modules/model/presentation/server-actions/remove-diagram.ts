"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import { RemoveDiagramUseCase } from "../../application/use-cases/remove-diagram";
import { diagramRepository } from "../../infrastructure/persistence/drizzle/repositories";

export const removeDiagram = withAuth(
  async (id: string, { token }): Promise<boolean> => {
    if (!id) {
      throw new Error("Diagram id is required");
    }

    const removeDiagramUseCase = new RemoveDiagramUseCase(diagramRepository);

    const response = await removeDiagramUseCase.execute({
      payload: { id },
      context: { token },
    });

    return response;
  },
);
