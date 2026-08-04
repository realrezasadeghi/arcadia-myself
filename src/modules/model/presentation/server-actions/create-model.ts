"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type CreateModelResponse,
  CreateModelUseCase,
} from "../../application/use-cases/create-model";
import { modelRepository } from "../../infrastructure/persistence/drizzle/repositories";
import { CreateModelDTO, type CreateModelDTOProps } from "../dtos/create-model";

export const createModel = withAuth(
  async (
    payload: CreateModelDTOProps,
    { token },
  ): Promise<CreateModelResponse> => {
    const dto = CreateModelDTO.create(payload);

    const createModelUseCase = new CreateModelUseCase(modelRepository);

    const response = await createModelUseCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
