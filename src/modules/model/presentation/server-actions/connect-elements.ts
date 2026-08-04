"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type ConnectElementsResponse,
  ConnectElementsUseCase,
} from "../../application/use-cases/connect-elements";
import {
  elementRepository,
  relationshipRepository,
} from "../../infrastructure/persistence/drizzle/repositories";
import {
  ConnectElementsDTO,
  type ConnectElementsDTOProps,
} from "../dtos/connect-elements";

export const connectElements = withAuth(
  async (
    payload: ConnectElementsDTOProps,
    { token },
  ): Promise<ConnectElementsResponse> => {
    const dto = ConnectElementsDTO.create(payload);

    const connectElementsUseCase = new ConnectElementsUseCase(
      elementRepository,
      relationshipRepository,
    );

    const response = await connectElementsUseCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
