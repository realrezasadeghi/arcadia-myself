"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  RemoveClassPropertyUseCase,
  type RemoveClassPropertyUseCaseResponse,
} from "../../application/use-cases/class-diagram/remove-class-property";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";

export const removeClassProperty = withAuth(
  async (
    id: string,
    { token },
  ): Promise<RemoveClassPropertyUseCaseResponse> => {
    const useCase = new RemoveClassPropertyUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: { id },
      context: { token },
    });

    return response;
  },
);
