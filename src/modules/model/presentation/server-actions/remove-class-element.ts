"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type RemoveClassElementUseCaseResponse,
  RemoveClassElementUseCase,
} from "../../application/use-cases/class-diagram/remove-class-element";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";

export type RemoveClassElementPayload = {
  id: string;
  modelId: string;
};

export const removeClassElement = withAuth(
  async (payload: RemoveClassElementPayload, { token }): Promise<RemoveClassElementUseCaseResponse> => {
    const useCase = new RemoveClassElementUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: { id: payload.id },
      context: { token },
    });

    return response;
  },
);
