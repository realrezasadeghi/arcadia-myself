"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { updateTag } from "next/cache";
import {
  type CreateElementResponse,
  CreateElementUseCase,
} from "../../application/use-cases/create-element";
import {
  elementRepository,
  modelRepository,
} from "../../infrastructure/persistence/drizzle/repositories";
import {
  CreateElementDTO,
  type CreateElementDTOProps,
} from "../dtos/create-element";

export async function createElement(
  payload: CreateElementDTOProps,
): Promise<IRes<CreateElementResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = CreateElementDTO.create(payload);

    const createElementUseCase = new CreateElementUseCase(
      modelRepository,
      elementRepository,
    );

    const response = await createElementUseCase.execute({
      payload: dto,
      context: { token },
    });

    updateTag(`get-elements-by-model-id-${payload.modelId}`);

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
