"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type GetFragmentOperandsByFragmentIdsResponse,
  GetFragmentOperandsByFragmentIdsUseCase,
} from "../../application/use-cases/get-fragment-operands-by-fragment-ids";
import { fragmentOperandRepository } from "../../infrastructure/persistence/drizzle/repositories";

export const getFragmentOperandsByFragmentIds = withAuth(
  async (
    payload: { fragmentIds: string[] },
    { token },
  ): Promise<GetFragmentOperandsByFragmentIdsResponse> => {
    const useCase = new GetFragmentOperandsByFragmentIdsUseCase(
      fragmentOperandRepository,
    );

    return useCase.execute({
      payload,
      context: { token },
    });
  },
);
