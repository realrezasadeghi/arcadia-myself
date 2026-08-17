"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type CreateLifelineResponse,
  CreateLifelineUseCase,
} from "../../application/use-cases/create-lifeline";
import {
  lifelineRepository,
  scenarioRepository,
} from "../../infrastructure/persistence/drizzle/repositories";
import {
  CreateLifelineDTO,
  type CreateLifelineDTOProps,
} from "../dtos/create-lifeline";

export const createLifeline = withAuth(
  async (
    payload: CreateLifelineDTOProps,
    { token },
  ): Promise<CreateLifelineResponse> => {
    const dto = CreateLifelineDTO.create(payload);

    const createLifelineUseCase = new CreateLifelineUseCase(
      lifelineRepository,
      scenarioRepository,
    );

    const response = await createLifelineUseCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
