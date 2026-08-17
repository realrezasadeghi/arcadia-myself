"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type CreateMessageResponse,
  CreateMessageUseCase,
} from "../../application/use-cases/create-message";
import {
  messageRepository,
  scenarioRepository,
} from "../../infrastructure/persistence/drizzle/repositories";
import {
  CreateMessageDTO,
  type CreateMessageDTOProps,
} from "../dtos/create-message";

export const createMessage = withAuth(
  async (
    payload: CreateMessageDTOProps,
    { token },
  ): Promise<CreateMessageResponse> => {
    const dto = CreateMessageDTO.create(payload);

    const createMessageUseCase = new CreateMessageUseCase(
      messageRepository,
      scenarioRepository,
    );

    const response = await createMessageUseCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
