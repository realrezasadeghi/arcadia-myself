"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import { updateTag } from "next/cache";
import { DiagramKindNameService } from "../../application/services/diagram-kind-names";
import {
  type UpdateClassDiagramUseCaseResponse,
  UpdateClassDiagramUseCase,
} from "../../application/use-cases/class-diagram/update-class-diagram";
import {
  classDiagramRepository,
  diagramRepository,
  scenarioRepository,
} from "../../infrastructure/persistence/drizzle/repositories";
import {
  UpdateClassDiagramDTO,
  type UpdateClassDiagramDTOProps,
} from "../dtos/update-class-diagram";

export const updateClassDiagram = withAuth(
  async (
    payload: UpdateClassDiagramDTOProps,
    { token },
  ): Promise<UpdateClassDiagramUseCaseResponse> => {
    const dto = UpdateClassDiagramDTO.create(payload);

    const useCase = new UpdateClassDiagramUseCase(
      classDiagramRepository,
      new DiagramKindNameService(
        diagramRepository,
        scenarioRepository,
        classDiagramRepository,
      ),
    );

    const response = await useCase.execute({
      payload: dto,
      context: { token },
    });

    updateTag(`get-class-diagrams-by-model-id-${payload.modelId}`);

    return response;
  },
);
