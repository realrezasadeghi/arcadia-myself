"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import { RemoveTraceLinkUseCase } from "../../application/use-cases/remove-trace-link";
import { traceLinkRepository } from "../../infrastructure/persistence/drizzle/repositories";

export type RemoveTraceLinkPayload = {
  id: string;
  sourceElementId: string;
  targetElementId: string;
};

export const removeTraceLink = withAuth(
  async (payload: RemoveTraceLinkPayload, { token }): Promise<boolean> => {
    if (!payload.id) {
      throw new Error("Trace link id is required");
    }

    const removeTraceLinkUseCase = new RemoveTraceLinkUseCase(
      traceLinkRepository,
    );

    const response = await removeTraceLinkUseCase.execute({
      payload: { id: payload.id },
      context: { token },
    });

    return response;
  },
);
