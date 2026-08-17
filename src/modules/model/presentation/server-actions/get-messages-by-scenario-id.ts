"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type GetMessagesByScenarioIdResponse,
  GetMessagesByScenarioIdUseCase,
} from "../../application/use-cases/get-messages-by-scenario-id";
import { messageRepository } from "../../infrastructure/persistence/drizzle/repositories";

export const getMessagesByScenarioId = withAuth(
  async (
    payload: { scenarioId: string },
    { token },
  ): Promise<GetMessagesByScenarioIdResponse> => {
    const getMessagesUseCase = new GetMessagesByScenarioIdUseCase(
      messageRepository,
    );

    const response = await getMessagesUseCase.execute({
      payload,
      context: { token },
    });

    return response;
  },
);
