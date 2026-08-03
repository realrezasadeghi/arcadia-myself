"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  CreateClassEnumerationLiteralUseCase,
  type CreateClassEnumerationLiteralUseCaseResponse,
} from "../../application/use-cases/class-diagram/create-class-enumeration-literal";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";

export type CreateClassEnumerationLiteralPayload = {
  classElementId: string;
  modelId: string;
  layer: string;
  name: string;
  value?: string;
  ordering?: number;
};

export const createClassEnumerationLiteral = withAuth(
  async (payload: CreateClassEnumerationLiteralPayload, { token }): Promise<CreateClassEnumerationLiteralUseCaseResponse> => {
    const useCase = new CreateClassEnumerationLiteralUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: {
        classElementId: payload.classElementId,
        modelId: payload.modelId,
        layer: payload.layer,
        name: payload.name,
        value: payload.value ?? "",
        ordering: payload.ordering ?? 0,
      },
      context: { token },
    });

    return response;
  },
);
