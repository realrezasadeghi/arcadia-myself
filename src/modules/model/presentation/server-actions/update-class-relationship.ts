"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { updateTag } from "next/cache";
import {
  type UpdateClassRelationshipUseCaseResponse,
  UpdateClassRelationshipUseCase,
} from "../../application/use-cases/class-diagram/update-class-relationship";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";
import {
  UpdateClassRelationshipDTO,
  type UpdateClassRelationshipDTOProps,
} from "../dtos/update-class-relationship";

export async function updateClassRelationship(
  payload: UpdateClassRelationshipDTOProps,
): Promise<IRes<UpdateClassRelationshipUseCaseResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = UpdateClassRelationshipDTO.create(payload);

    const useCase = new UpdateClassRelationshipUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: dto,
      context: { token },
    });

    updateTag(`get-class-relationships-by-model-id-${payload.modelId}`);

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}