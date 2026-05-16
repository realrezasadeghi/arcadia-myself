"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import {
  type CreateDiagramResponse,
  CreateDiagramUseCase,
} from "../../application/use-cases/create-diagram";
import {
  diagramRepository,
  modelRepository,
} from "../../infrastructure/persistence/drizzle/repositories";
import {
  CreateDiagramDTO,
  type CreateDiagramDTOProps,
} from "../dtos/create-diagram";

export async function createDiagram(
  payload: CreateDiagramDTOProps,
): Promise<IRes<CreateDiagramResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = CreateDiagramDTO.create(payload);

    const createDiagramUseCase = new CreateDiagramUseCase(
      diagramRepository,
      modelRepository,
    );

    const response = await createDiagramUseCase.execute({
      payload: dto,
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
