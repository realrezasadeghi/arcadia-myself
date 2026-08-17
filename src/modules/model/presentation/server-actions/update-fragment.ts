"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type UpdateFragmentResponse,
  UpdateFragmentUseCase,
} from "../../application/use-cases/update-fragment";
import { fragmentRepository } from "../../infrastructure/persistence/drizzle/repositories";

export const updateFragment = withAuth(
  async (
    payload: { id: string; name: string; guard?: string },
    { token },
  ): Promise<UpdateFragmentResponse> => {
    const updateFragmentUseCase = new UpdateFragmentUseCase(fragmentRepository);

    const response = await updateFragmentUseCase.execute({
      payload,
      context: { token },
    });

    return response;
  },
);
