"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { updateTag } from "next/cache";
import {
  type CreateModelResponse,
  CreateModelUseCase,
} from "../../application/use-cases/create-model";
import { modelRepository } from "../../infrastructure/persistence/drizzle/repositories";
import { CreateModelDTO, type CreateModelDTOProps } from "../dtos/create-model";

export async function createModel(
  payload: CreateModelDTOProps,
): Promise<IRes<CreateModelResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = CreateModelDTO.create(payload);

    const createModelUseCase = new CreateModelUseCase(modelRepository);

    const response = await createModelUseCase.execute({
      payload: dto,
      context: { token },
    });

    updateTag(`get-models-by-project-id-${payload.projectId}`);

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
