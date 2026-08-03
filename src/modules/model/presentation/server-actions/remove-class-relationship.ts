"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type RemoveClassRelationshipUseCaseResponse,
  RemoveClassRelationshipUseCase,
} from "../../application/use-cases/class-diagram/remove-class-relationship";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";

export type RemoveClassRelationshipPayload = {
  id: string;
  modelId: string;
};

export const removeClassRelationship = withAuth(
  async (payload: RemoveClassRelationshipPayload, { token }): Promise<RemoveClassRelationshipUseCaseResponse> => {
    const useCase = new RemoveClassRelationshipUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: { id: payload.id },
      context: { token },
    });

    return response;
  },
);
