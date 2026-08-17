"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type UpdateFragmentPositionResponse,
  UpdateFragmentPositionUseCase,
} from "../../application/use-cases/update-fragment-position";
import { fragmentRepository } from "../../infrastructure/persistence/drizzle/repositories";

export const updateFragmentPosition = withAuth(
  async (
    payload: {
      id: string;
      rowIndex: number;
      columnIndex: number;
      spanColumns?: number;
    },
    { token },
  ): Promise<UpdateFragmentPositionResponse> => {
    const updateFragmentPositionUseCase = new UpdateFragmentPositionUseCase(
      fragmentRepository,
    );

    const response = await updateFragmentPositionUseCase.execute({
      payload,
      context: { token },
    });

    return response;
  },
);
