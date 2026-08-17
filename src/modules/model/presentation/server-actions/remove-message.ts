"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type RemoveMessageResponse,
  RemoveMessageUseCase,
} from "../../application/use-cases/remove-message";
import { messageRepository } from "../../infrastructure/persistence/drizzle/repositories";

export const removeMessage = withAuth(
  async (
    payload: { id: string },
    { token },
  ): Promise<RemoveMessageResponse> => {
    const removeMessageUseCase = new RemoveMessageUseCase(messageRepository);

    const response = await removeMessageUseCase.execute({
      payload,
      context: { token },
    });

    return response;
  },
);
