"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  CreateClassPropertyUseCase,
  type CreateClassPropertyUseCaseResponse,
} from "../../application/use-cases/class-diagram/create-class-property";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";

export type CreateClassPropertyPayload = {
  classElementId: string;
  modelId: string;
  layer: string;
  name: string;
  typeClassElementId?: string | null;
  typeLiteral?: string;
  isStatic?: boolean;
  isReadOnly?: boolean;
  isDerived?: boolean;
  visibility?: string;
  multiplicityLower?: number;
  multiplicityUpper?: string;
  collectionKind?: string;
  defaultValue?: string;
  ordering?: number;
};

export const createClassProperty = withAuth(
  async (
    payload: CreateClassPropertyPayload,
    { token },
  ): Promise<CreateClassPropertyUseCaseResponse> => {
    const useCase = new CreateClassPropertyUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: {
        classElementId: payload.classElementId,
        modelId: payload.modelId,
        layer: payload.layer,
        name: payload.name,
        typeClassElementId: payload.typeClassElementId ?? null,
        typeLiteral: payload.typeLiteral ?? "",
        isStatic: payload.isStatic ?? false,
        isReadOnly: payload.isReadOnly ?? false,
        isDerived: payload.isDerived ?? false,
        visibility: payload.visibility ?? "public",
        multiplicityLower: payload.multiplicityLower ?? 1,
        multiplicityUpper: payload.multiplicityUpper ?? "1",
        collectionKind: payload.collectionKind ?? "NONE",
        defaultValue: payload.defaultValue ?? "",
        ordering: payload.ordering ?? 0,
      },
      context: { token },
    });

    return response;
  },
);
