"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type UpdateModelResponse,
  UpdateModelUseCase,
} from "../../application/use-cases/update-model";
import { modelRepository } from "../../infrastructure/persistence/drizzle/repositories";
import { UpdateModelDTO, type UpdateModelDTOProps } from "../dtos/update-model";

export const updateModel = withAuth(
  async (payload: UpdateModelDTOProps, { token }): Promise<UpdateModelResponse> => {
    const dto = UpdateModelDTO.create(payload);

    const updateModelUseCase = new UpdateModelUseCase(modelRepository);

    const response = await updateModelUseCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
