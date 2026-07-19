"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { updateTag } from "next/cache";
import {
  type CreateClassElementUseCaseResponse,
  CreateClassElementUseCase,
} from "../../application/use-cases/class-diagram/create-class-element";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";
import {
  CreateClassElementDTO,
  type CreateClassElementDTOProps,
} from "../dtos/create-class-element";

export async function createClassElement(
  payload: CreateClassElementDTOProps,
): Promise<IRes<CreateClassElementUseCaseResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = CreateClassElementDTO.create(payload);

    const useCase = new CreateClassElementUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: dto,
      context: { token },
    });

    updateTag(`get-class-elements-by-model-id-${payload.modelId}`);

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}