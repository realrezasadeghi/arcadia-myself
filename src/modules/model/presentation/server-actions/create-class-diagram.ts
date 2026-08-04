"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import { updateTag } from "next/cache";
import {
  CreateClassDiagramUseCase,
  type CreateClassDiagramUseCaseResponse,
} from "../../application/use-cases/class-diagram/create-class-diagram";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";
import {
  CreateClassDiagramDTO,
  type CreateClassDiagramDTOProps,
} from "../dtos/create-class-diagram";

export const createClassDiagram = withAuth(
  async (
    payload: CreateClassDiagramDTOProps,
    { token },
  ): Promise<CreateClassDiagramUseCaseResponse> => {
    const dto = CreateClassDiagramDTO.create(payload);

    const useCase = new CreateClassDiagramUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: dto,
      context: { token },
    });

    updateTag(`get-class-diagrams-by-model-id-${payload.modelId}`);

    return response;
  },
);
