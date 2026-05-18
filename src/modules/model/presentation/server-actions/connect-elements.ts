"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { updateTag } from "next/cache";
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

export async function connectElements(
  payload: ConnectElementsDTOProps,
): Promise<IRes<ConnectElementsResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = ConnectElementsDTO.create(payload);

    const connectElementsUseCase = new ConnectElementsUseCase(
      elementRepository,
      relationshipRepository,
    );

    const response = await connectElementsUseCase.execute({
      payload: dto,
      context: { token },
    });

    updateTag(`get-elements-by-model-id-${payload.modelId}`);

    updateTag(`get-relationships-by-model-id-${payload.modelId}`);

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
