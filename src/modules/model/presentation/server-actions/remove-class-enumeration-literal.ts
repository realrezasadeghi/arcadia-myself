"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  RemoveClassEnumerationLiteralUseCase,
  type RemoveClassEnumerationLiteralUseCaseResponse,
} from "../../application/use-cases/class-diagram/remove-class-enumeration-literal";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";

export const removeClassEnumerationLiteral = withAuth(
  async (id: string, { token }): Promise<RemoveClassEnumerationLiteralUseCaseResponse> => {
    const useCase = new RemoveClassEnumerationLiteralUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: { id },
      context: { token },
    });

    return response;
  },
);
