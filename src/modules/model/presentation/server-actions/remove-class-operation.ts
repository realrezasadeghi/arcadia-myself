"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  RemoveClassOperationUseCase,
  type RemoveClassOperationUseCaseResponse,
} from "../../application/use-cases/class-diagram/remove-class-operation";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";

export const removeClassOperation = withAuth(
  async (id: string, { token }): Promise<RemoveClassOperationUseCaseResponse> => {
    const useCase = new RemoveClassOperationUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: { id },
      context: { token },
    });

    return response;
  },
);
