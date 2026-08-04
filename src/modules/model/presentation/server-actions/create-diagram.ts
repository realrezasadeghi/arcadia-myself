"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type CreateDiagramResponse,
  CreateDiagramUseCase,
} from "../../application/use-cases/create-diagram";
import {
  diagramRepository,
  modelRepository,
} from "../../infrastructure/persistence/drizzle/repositories";
import {
  CreateDiagramDTO,
  type CreateDiagramDTOProps,
} from "../dtos/create-diagram";

export const createDiagram = withAuth(
  async (
    payload: CreateDiagramDTOProps,
    { token },
  ): Promise<CreateDiagramResponse> => {
    const dto = CreateDiagramDTO.create(payload);

    const createDiagramUseCase = new CreateDiagramUseCase(
      diagramRepository,
      modelRepository,
    );

    const response = await createDiagramUseCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
