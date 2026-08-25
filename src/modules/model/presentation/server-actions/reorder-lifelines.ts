"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type ReorderLifelinesResponse,
  ReorderLifelinesUseCase,
} from "../../application/use-cases/reorder-lifelines";
import { lifelineRepository } from "../../infrastructure/persistence/drizzle/repositories";

export const reorderLifelines = withAuth(
  async (
    payload: { scenarioId: string; lifelineIds: string[] },
    { token },
  ): Promise<ReorderLifelinesResponse> => {
    const reorderLifelinesUseCase = new ReorderLifelinesUseCase(
      lifelineRepository,
    );

    await reorderLifelinesUseCase.execute({
      payload,
      context: { token },
    });
  },
);
