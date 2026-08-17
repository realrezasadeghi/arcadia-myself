"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type UpdateLifelineResponse,
  UpdateLifelineUseCase,
} from "../../application/use-cases/update-lifeline";
import { lifelineRepository } from "../../infrastructure/persistence/drizzle/repositories";

export const updateLifeline = withAuth(
  async (
    payload: { id: string; name: string },
    { token },
  ): Promise<UpdateLifelineResponse> => {
    const updateLifelineUseCase = new UpdateLifelineUseCase(lifelineRepository);

    const response = await updateLifelineUseCase.execute({
      payload,
      context: { token },
    });

    return response;
  },
);
