"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import { DiagramKindNameService } from "../../application/services/diagram-kind-names";
import {
  type CreateDiagramResponse,
  CreateDiagramUseCase,
} from "../../application/use-cases/create-diagram";
import {
  classDiagramRepository,
  diagramRepository,
  modelRepository,
  scenarioRepository,
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
      new DiagramKindNameService(
        diagramRepository,
        scenarioRepository,
        classDiagramRepository,
      ),
    );

    const response = await createDiagramUseCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
