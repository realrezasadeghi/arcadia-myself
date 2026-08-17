"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type UpdateMessageResponse,
  UpdateMessageUseCase,
} from "../../application/use-cases/update-message";
import { messageRepository } from "../../infrastructure/persistence/drizzle/repositories";

export const updateMessage = withAuth(
  async (
    payload: { id: string; name: string },
    { token },
  ): Promise<UpdateMessageResponse> => {
    const updateMessageUseCase = new UpdateMessageUseCase(messageRepository);

    const response = await updateMessageUseCase.execute({
      payload,
      context: { token },
    });

    return response;
  },
);
