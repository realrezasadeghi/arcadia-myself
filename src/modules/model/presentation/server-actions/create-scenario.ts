"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type CreateScenarioResponse,
  CreateScenarioUseCase,
} from "../../application/use-cases/create-scenario";
import {
  modelRepository,
  scenarioRepository,
} from "../../infrastructure/persistence/drizzle/repositories";
import {
  CreateScenarioDTO,
  type CreateScenarioDTOProps,
} from "../dtos/create-scenario";

export const createScenario = withAuth(
  async (
    payload: CreateScenarioDTOProps,
    { token },
  ): Promise<CreateScenarioResponse> => {
    const dto = CreateScenarioDTO.create(payload);

    const createScenarioUseCase = new CreateScenarioUseCase(
      scenarioRepository,
      modelRepository,
    );

    const response = await createScenarioUseCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
