"use server";

import {
  type CreateScenarioDiagramResponse,
  CreateScenarioDiagramUseCase,
} from "@/modules/model/application/use-cases/scenario/create-diagram";
import {
  modelRepository,
  scenarioDiagramRepository,
} from "@/modules/model/infrastructure/persistence/drizzle/repositories";
import {
  type CreateScenarioDiagramDTO,
  createScenarioDiagramSchema,
} from "@/modules/model/presentation/dtos/scenario";
import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";

export async function createScenarioDiagram(
  payload: CreateScenarioDiagramDTO,
): Promise<IRes<CreateScenarioDiagramResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = createScenarioDiagramSchema.parse(payload);

    const useCase = new CreateScenarioDiagramUseCase(
      scenarioDiagramRepository,
      modelRepository,
    );

    const response = await useCase.execute({
      payload: dto,
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
