"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type CreateTraceLinkResponse,
  CreateTraceLinkUseCase,
} from "../../application/use-cases/create-trace-link";
import {
  elementRepository,
  traceLinkRepository,
} from "../../infrastructure/persistence/drizzle/repositories";
import {
  CreateTraceLinkDTO,
  type CreateTraceLinkDTOProps,
} from "../dtos/create-trace-link";

export const createTraceLink = withAuth(
  async (payload: CreateTraceLinkDTOProps, { token }): Promise<CreateTraceLinkResponse> => {
    const createTraceLinkUseCase = new CreateTraceLinkUseCase(
      traceLinkRepository,
      elementRepository,
    );

    const dto = CreateTraceLinkDTO.create(payload);

    const response = await createTraceLinkUseCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
