"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, ok, type IRes } from "@/modules/shared/utils/response";
import {
  UpdateScenarioMessageUseCase,
  type UpdateScenarioMessageResponse,
} from "@/modules/model/application/use-cases/scenario/update-message";
import { scenarioMessageRepository } from "@/modules/model/infrastructure/persistence/drizzle/repositories";
import { updateScenarioMessageSchema, type UpdateScenarioMessageDTO } from "@/modules/model/presentation/dtos/scenario";

export async function updateScenarioMessage(
  payload: UpdateScenarioMessageDTO,
): Promise<IRes<UpdateScenarioMessageResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = updateScenarioMessageSchema.parse(payload);

    const useCase = new UpdateScenarioMessageUseCase(scenarioMessageRepository);

    const response = await useCase.execute({
      payload: dto,
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}