"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type RemoveClassOperationParameterUseCaseResponse,
  RemoveClassOperationParameterUseCase,
} from "../../application/use-cases/class-diagram/remove-class-operation-parameter";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";

export const removeClassOperationParameter = withAuth(
  async (id: string, { token }): Promise<RemoveClassOperationParameterUseCaseResponse> => {
    const useCase = new RemoveClassOperationParameterUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: { id },
      context: { token },
    });

    return response;
  },
);
