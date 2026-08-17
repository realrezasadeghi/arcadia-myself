"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type UpdateScenarioResponse,
  UpdateScenarioUseCase,
} from "../../application/use-cases/update-scenario";
import { scenarioRepository } from "../../infrastructure/persistence/drizzle/repositories";

export const updateScenario = withAuth(
  async (
    payload: { id: string; name: string; description?: string },
    { token },
  ): Promise<UpdateScenarioResponse> => {
    const updateScenarioUseCase = new UpdateScenarioUseCase(scenarioRepository);

    const response = await updateScenarioUseCase.execute({
      payload,
      context: { token },
    });

    return response;
  },
);
