"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type RemoveClassDiagramUseCaseResponse,
  RemoveClassDiagramUseCase,
} from "../../application/use-cases/class-diagram/remove-class-diagram";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";

export type RemoveClassDiagramPayload = {
  id: string;
  modelId: string;
};

export const removeClassDiagram = withAuth(
  async (payload: RemoveClassDiagramPayload, { token }): Promise<RemoveClassDiagramUseCaseResponse> => {
    const useCase = new RemoveClassDiagramUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: { id: payload.id },
      context: { token },
    });

    return response;
  },
);
