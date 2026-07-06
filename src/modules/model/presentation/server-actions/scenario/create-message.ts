"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, ok, type IRes } from "@/modules/shared/utils/response";
import {
  CreateScenarioMessageUseCase,
  type CreateScenarioMessageResponse,
} from "@/modules/model/application/use-cases/scenario/create-message";
import {
  scenarioDiagramRepository,
  scenarioLifelineRepository,
  scenarioMessageRepository,
} from "@/modules/model/infrastructure/persistence/drizzle/repositories";
import { createScenarioMessageSchema, type CreateScenarioMessageDTO } from "@/modules/model/presentation/dtos/scenario";

export async function createScenarioMessage(
  payload: CreateScenarioMessageDTO,
): Promise<IRes<CreateScenarioMessageResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = createScenarioMessageSchema.parse(payload);

    const useCase = new CreateScenarioMessageUseCase(
      scenarioMessageRepository,
      scenarioDiagramRepository,
      scenarioLifelineRepository,
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