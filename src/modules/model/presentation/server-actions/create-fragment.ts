"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type CreateFragmentResponse,
  CreateFragmentUseCase,
} from "../../application/use-cases/create-fragment";
import {
  fragmentRepository,
  scenarioRepository,
} from "../../infrastructure/persistence/drizzle/repositories";
import {
  CreateFragmentDTO,
  type CreateFragmentDTOProps,
} from "../dtos/create-fragment";

export const createFragment = withAuth(
  async (
    payload: CreateFragmentDTOProps,
    { token },
  ): Promise<CreateFragmentResponse> => {
    const dto = CreateFragmentDTO.create(payload);

    const createFragmentUseCase = new CreateFragmentUseCase(
      fragmentRepository,
      scenarioRepository,
    );

    const response = await createFragmentUseCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
