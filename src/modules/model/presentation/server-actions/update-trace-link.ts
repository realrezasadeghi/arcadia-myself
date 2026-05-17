"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import {
  UpdateTraceLinkDescriptionUseCase,
  type UpdateTraceLinkResponse,
} from "../../application/use-cases/update-trace-link";
import { traceLinkRepository } from "../../infrastructure/persistence/drizzle/repositories";
import {
  UpdateTraceLinkDTO,
  type UpdateTraceLinkDTOProps,
} from "../dtos/update-trace-link";

export async function updateTraceLink(
  payload: UpdateTraceLinkDTOProps,
): Promise<IRes<UpdateTraceLinkResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = UpdateTraceLinkDTO.create(payload);

    const updateTraceLinkUseCase = new UpdateTraceLinkDescriptionUseCase(
      traceLinkRepository,
    );

    const response = await updateTraceLinkUseCase.execute({
      payload: dto,
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
