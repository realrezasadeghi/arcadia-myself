"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { updateTag } from "next/cache";
import {
  type UpdateClassElementUseCaseResponse,
  UpdateClassElementUseCase,
} from "../../application/use-cases/class-diagram/update-class-element";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";
import { UpdateClassElementDTO, type UpdateClassElementDTOProps } from "../dtos/update-class-element";

export async function updateClassElement(
  payload: UpdateClassElementDTOProps,
): Promise<IRes<UpdateClassElementUseCaseResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = UpdateClassElementDTO.create(payload);

    const useCase = new UpdateClassElementUseCase(classDiagramRepository);

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