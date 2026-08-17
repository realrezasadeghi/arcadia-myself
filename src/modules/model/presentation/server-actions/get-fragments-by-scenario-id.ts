"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type GetFragmentsByScenarioIdResponse,
  GetFragmentsByScenarioIdUseCase,
} from "../../application/use-cases/get-fragments-by-scenario-id";
import { fragmentRepository } from "../../infrastructure/persistence/drizzle/repositories";

export const getFragmentsByScenarioId = withAuth(
  async (
    payload: { scenarioId: string },
    { token },
  ): Promise<GetFragmentsByScenarioIdResponse> => {
    const getFragmentsUseCase = new GetFragmentsByScenarioIdUseCase(
      fragmentRepository,
    );

    const response = await getFragmentsUseCase.execute({
      payload,
      context: { token },
    });

    return response;
  },
);
