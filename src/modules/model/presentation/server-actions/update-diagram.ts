"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import {
  type UpdateDiagramResponse,
  UpdateDiagramUseCase,
} from "../../application/use-cases/update-diagram";
import { diagramRepository } from "../../infrastructure/persistence/drizzle/repositories";
import {
  UpdateDiagramDTO,
  type UpdateDiagramDTOProps,
} from "../dtos/update-diagram";

export async function updateDiagram(
  payload: UpdateDiagramDTOProps,
): Promise<IRes<UpdateDiagramResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = UpdateDiagramDTO.create(payload);

    const updateDiagramUseCase = new UpdateDiagramUseCase(diagramRepository);

    const response = await updateDiagramUseCase.execute({
      payload: dto,
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
