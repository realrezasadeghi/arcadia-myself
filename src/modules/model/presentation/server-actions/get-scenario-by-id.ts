"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type GetScenarioByIdResponse,
  GetScenarioByIdUseCase,
} from "../../application/use-cases/get-scenario-by-id";
import { scenarioRepository } from "../../infrastructure/persistence/drizzle/repositories";

export const getScenarioById = withAuth(
  async (
    payload: { id: string },
    { token },
  ): Promise<GetScenarioByIdResponse | null> => {
    const getScenarioByIdUseCase = new GetScenarioByIdUseCase(
      scenarioRepository,
    );

    const response = await getScenarioByIdUseCase.execute({
      payload,
      context: { token },
    });

    return response;
  },
);
