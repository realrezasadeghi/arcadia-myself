"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type GetLifelinesByScenarioIdResponse,
  GetLifelinesByScenarioIdUseCase,
} from "../../application/use-cases/get-lifelines-by-scenario-id";
import { lifelineRepository } from "../../infrastructure/persistence/drizzle/repositories";

export const getLifelinesByScenarioId = withAuth(
  async (
    payload: { scenarioId: string },
    { token },
  ): Promise<GetLifelinesByScenarioIdResponse> => {
    const getLifelinesUseCase = new GetLifelinesByScenarioIdUseCase(
      lifelineRepository,
    );

    const response = await getLifelinesUseCase.execute({
      payload,
      context: { token },
    });

    return response;
  },
);
