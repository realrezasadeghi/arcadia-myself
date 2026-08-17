"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type GetScenariosByModelIdResponse,
  GetScenariosByModelIdUseCase,
} from "../../application/use-cases/get-scenarios-by-model-id";
import { scenarioRepository } from "../../infrastructure/persistence/drizzle/repositories";

export const getScenariosByModelId = withAuth(
  async (
    payload: { modelId: string },
    { token },
  ): Promise<GetScenariosByModelIdResponse> => {
    const getScenariosByModelIdUseCase = new GetScenariosByModelIdUseCase(
      scenarioRepository,
    );

    const response = await getScenariosByModelIdUseCase.execute({
      payload,
      context: { token },
    });

    return response;
  },
);
