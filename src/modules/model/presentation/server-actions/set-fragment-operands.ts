"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  SetFragmentOperandsUseCase,
  type SetFragmentOperandsUseCaseResponse,
} from "../../application/use-cases/set-fragment-operands";
import { fragmentOperandRepository } from "../../infrastructure/persistence/drizzle/repositories";

export const setFragmentOperands = withAuth(
  async (
    payload: {
      fragmentId: string;
      operands: { position: number; guard: string }[];
    },
    { token },
  ): Promise<SetFragmentOperandsUseCaseResponse> => {
    const useCase = new SetFragmentOperandsUseCase(fragmentOperandRepository);

    return useCase.execute({
      payload,
      context: { token },
    });
  },
);
