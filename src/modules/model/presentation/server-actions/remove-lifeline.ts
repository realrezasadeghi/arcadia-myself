"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type RemoveLifelineResponse,
  RemoveLifelineUseCase,
} from "../../application/use-cases/remove-lifeline";
import { lifelineRepository } from "../../infrastructure/persistence/drizzle/repositories";

export const removeLifeline = withAuth(
  async (
    payload: { id: string },
    { token },
  ): Promise<RemoveLifelineResponse> => {
    const removeLifelineUseCase = new RemoveLifelineUseCase(lifelineRepository);

    const response = await removeLifelineUseCase.execute({
      payload,
      context: { token },
    });

    return response;
  },
);
