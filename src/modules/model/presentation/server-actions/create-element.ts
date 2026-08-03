"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type CreateElementResponse,
  CreateElementUseCase,
} from "../../application/use-cases/create-element";
import {
  elementRepository,
  modelRepository,
} from "../../infrastructure/persistence/drizzle/repositories";
import {
  CreateElementDTO,
  type CreateElementDTOProps,
} from "../dtos/create-element";

export const createElement = withAuth(
  async (payload: CreateElementDTOProps, { token }): Promise<CreateElementResponse> => {
    const dto = CreateElementDTO.create(payload);

    const createElementUseCase = new CreateElementUseCase(
      modelRepository,
      elementRepository,
    );

    const response = await createElementUseCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
