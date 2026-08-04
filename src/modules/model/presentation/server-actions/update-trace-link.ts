"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  UpdateTraceLinkDescriptionUseCase,
  type UpdateTraceLinkResponse,
} from "../../application/use-cases/update-trace-link";
import { traceLinkRepository } from "../../infrastructure/persistence/drizzle/repositories";
import {
  UpdateTraceLinkDTO,
  type UpdateTraceLinkDTOProps,
} from "../dtos/update-trace-link";

export const updateTraceLink = withAuth(
  async (
    payload: UpdateTraceLinkDTOProps,
    { token },
  ): Promise<UpdateTraceLinkResponse> => {
    const dto = UpdateTraceLinkDTO.create(payload);

    const updateTraceLinkUseCase = new UpdateTraceLinkDescriptionUseCase(
      traceLinkRepository,
    );

    const response = await updateTraceLinkUseCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
