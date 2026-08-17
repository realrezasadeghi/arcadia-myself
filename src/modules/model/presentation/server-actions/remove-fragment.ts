"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type RemoveFragmentResponse,
  RemoveFragmentUseCase,
} from "../../application/use-cases/remove-fragment";
import { fragmentRepository } from "../../infrastructure/persistence/drizzle/repositories";

export const removeFragment = withAuth(
  async (
    payload: { id: string },
    { token },
  ): Promise<RemoveFragmentResponse> => {
    const removeFragmentUseCase = new RemoveFragmentUseCase(fragmentRepository);

    const response = await removeFragmentUseCase.execute({
      payload,
      context: { token },
    });

    return response;
  },
);
