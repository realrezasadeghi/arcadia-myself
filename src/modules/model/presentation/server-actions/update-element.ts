"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { updateTag } from "next/cache";
import {
  type UpdateElementResponse,
  UpdateElementUseCase,
} from "../../application/use-cases/update-element";
import { elementRepository } from "../../infrastructure/persistence/drizzle/repositories";
import {
  UpdateElementDTO,
  type UpdateElementDTOProps,
} from "../dtos/update-element";

export async function updateElement(
  payload: UpdateElementDTOProps,
): Promise<IRes<UpdateElementResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = UpdateElementDTO.create(payload);

    const updateElementUseCase = new UpdateElementUseCase(elementRepository);

    const response = await updateElementUseCase.execute({
      payload: dto,
      context: { token },
    });

    updateTag(`get-element-by-id-${payload.id}`);

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
