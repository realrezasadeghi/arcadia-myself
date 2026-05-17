"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import {
  type CreateTraceLinkResponse,
  CreateTraceLinkUseCase,
} from "../../application/use-cases/create-trace-link";
import {
  elementRepository,
  traceLinkRepository,
} from "../../infrastructure/persistence/drizzle/repositories";
import {
  CreateTraceLinkDTO,
  type CreateTraceLinkDTOProps,
} from "../dtos/create-trace-link";

export async function createTraceLink(
  payload: CreateTraceLinkDTOProps,
): Promise<IRes<CreateTraceLinkResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const createTraceLinkUseCase = new CreateTraceLinkUseCase(
      traceLinkRepository,
      elementRepository,
    );

    const dto = CreateTraceLinkDTO.create(payload);

    const response = await createTraceLinkUseCase.execute({
      payload: dto,
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
