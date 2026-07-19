"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { updateTag } from "next/cache";
import {
  type UpdateClassDiagramUseCaseResponse,
  UpdateClassDiagramUseCase,
} from "../../application/use-cases/class-diagram/update-class-diagram";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";
import { UpdateClassDiagramDTO, type UpdateClassDiagramDTOProps } from "../dtos/update-class-diagram";

export async function updateClassDiagram(
  payload: UpdateClassDiagramDTOProps,
): Promise<IRes<UpdateClassDiagramUseCaseResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = UpdateClassDiagramDTO.create(payload);

    const useCase = new UpdateClassDiagramUseCase(classDiagramRepository);

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