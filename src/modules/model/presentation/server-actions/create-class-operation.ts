"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  CreateClassOperationUseCase,
  type CreateClassOperationUseCaseResponse,
} from "../../application/use-cases/class-diagram/create-class-operation";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";

export type CreateClassOperationPayload = {
  classElementId: string;
  modelId: string;
  layer: string;
  name: string;
  returnTypeClassElementId?: string | null;
  returnTypeLiteral?: string;
  isStatic?: boolean;
  isAbstract?: boolean;
  visibility?: string;
  ordering?: number;
};

export const createClassOperation = withAuth(
  async (
    payload: CreateClassOperationPayload,
    { token },
  ): Promise<CreateClassOperationUseCaseResponse> => {
    const useCase = new CreateClassOperationUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: {
        classElementId: payload.classElementId,
        modelId: payload.modelId,
        layer: payload.layer,
        name: payload.name,
        returnTypeClassElementId: payload.returnTypeClassElementId ?? null,
        returnTypeLiteral: payload.returnTypeLiteral ?? "",
        isStatic: payload.isStatic ?? false,
        isAbstract: payload.isAbstract ?? false,
        visibility: payload.visibility ?? "public",
        ordering: payload.ordering ?? 0,
      },
      context: { token },
    });

    return response;
  },
);
