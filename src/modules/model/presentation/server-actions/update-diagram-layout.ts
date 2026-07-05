"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import {
  type UpdateDiagramLayoutResponse,
  UpdateDiagramLayoutUseCase,
} from "../../application/use-cases/update-diagram-layout";
import { diagramLayoutRepository } from "../../infrastructure/persistence/drizzle/repositories";
import {
  UpdateDiagramLayoutDTO,
  type UpdateDiagramLayoutDTOProps,
} from "../dtos/update-diagram-layout";

export async function updateDiagramLayout(
  payload: UpdateDiagramLayoutDTOProps,
): Promise<IRes<UpdateDiagramLayoutResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = UpdateDiagramLayoutDTO.create(payload);
    const updateDiagramLayoutUseCase = new UpdateDiagramLayoutUseCase(
      diagramLayoutRepository,
    );

    const response = await updateDiagramLayoutUseCase.execute({
      payload: dto,
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
