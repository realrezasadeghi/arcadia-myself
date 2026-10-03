"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import { DiagramKindNameService } from "../../application/services/diagram-kind-names";
import {
  type UpdateScenarioResponse,
  UpdateScenarioUseCase,
} from "../../application/use-cases/update-scenario";
import {
  classDiagramRepository,
  diagramRepository,
  scenarioRepository,
} from "../../infrastructure/persistence/drizzle/repositories";
import {
  UpdateScenarioDTO,
  type UpdateScenarioDTOProps,
} from "../dtos/update-scenario";

export const updateScenario = withAuth(
  async (
    payload: UpdateScenarioDTOProps,
    { token },
  ): Promise<UpdateScenarioResponse> => {
    const dto = UpdateScenarioDTO.create(payload);

    const updateScenarioUseCase = new UpdateScenarioUseCase(
      scenarioRepository,
      new DiagramKindNameService(
        diagramRepository,
        scenarioRepository,
        classDiagramRepository,
      ),
    );

    const response = await updateScenarioUseCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
