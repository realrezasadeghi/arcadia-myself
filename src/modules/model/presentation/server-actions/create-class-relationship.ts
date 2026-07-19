"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { updateTag } from "next/cache";
import {
  type CreateClassRelationshipUseCaseResponse,
  CreateClassRelationshipUseCase,
} from "../../application/use-cases/class-diagram/create-class-relationship";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";
import {
  CreateClassRelationshipDTO,
  type CreateClassRelationshipDTOProps,
} from "../dtos/create-class-relationship";

export async function createClassRelationship(
  payload: CreateClassRelationshipDTOProps,
): Promise<IRes<CreateClassRelationshipUseCaseResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = CreateClassRelationshipDTO.create(payload);

    const useCase = new CreateClassRelationshipUseCase(classDiagramRepository);

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