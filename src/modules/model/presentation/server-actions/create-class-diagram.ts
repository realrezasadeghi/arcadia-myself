"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { updateTag } from "next/cache";
import {
  type CreateClassDiagramUseCaseResponse,
  CreateClassDiagramUseCase,
} from "../../application/use-cases/class-diagram/create-class-diagram";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";
import {
  CreateClassDiagramDTO,
  type CreateClassDiagramDTOProps,
} from "../dtos/create-class-diagram";

export async function createClassDiagram(
  payload: CreateClassDiagramDTOProps,
): Promise<IRes<CreateClassDiagramUseCaseResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = CreateClassDiagramDTO.create(payload);

    const useCase = new CreateClassDiagramUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: dto,
      context: { token },
    });

    updateTag(`get-class-diagrams-by-model-id-${payload.modelId}`);

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}