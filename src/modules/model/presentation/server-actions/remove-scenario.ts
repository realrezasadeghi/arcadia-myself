"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type RemoveScenarioResponse,
  RemoveScenarioUseCase,
} from "../../application/use-cases/remove-scenario";
import { scenarioRepository } from "../../infrastructure/persistence/drizzle/repositories";

export const removeScenario = withAuth(
  async (
    payload: { id: string },
    { token },
  ): Promise<RemoveScenarioResponse> => {
    const removeScenarioUseCase = new RemoveScenarioUseCase(scenarioRepository);

    const response = await removeScenarioUseCase.execute({
      payload,
      context: { token },
    });

    return response;
  },
);
