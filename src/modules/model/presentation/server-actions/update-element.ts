"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type UpdateElementResponse,
  UpdateElementUseCase,
} from "../../application/use-cases/update-element";
import { elementRepository } from "../../infrastructure/persistence/drizzle/repositories";
import {
  UpdateElementDTO,
  type UpdateElementDTOProps,
} from "../dtos/update-element";

export const updateElement = withAuth(
  async (
    payload: UpdateElementDTOProps,
    { token },
  ): Promise<UpdateElementResponse> => {
    const dto = UpdateElementDTO.create(payload);

    const updateElementUseCase = new UpdateElementUseCase(elementRepository);

    const response = await updateElementUseCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
