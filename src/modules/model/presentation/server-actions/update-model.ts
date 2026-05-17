"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import {
  type UpdateModelResponse,
  UpdateModelUseCase,
} from "../../application/use-cases/update-model";
import { modelRepository } from "../../infrastructure/persistence/drizzle/repositories";
import { UpdateModelDTO, type UpdateModelDTOProps } from "../dtos/update-model";

export async function updateModel(
  payload: UpdateModelDTOProps,
): Promise<IRes<UpdateModelResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = UpdateModelDTO.create(payload);

    const updateModelUseCase = new UpdateModelUseCase(modelRepository);

    const response = await updateModelUseCase.execute({
      payload: dto,
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
