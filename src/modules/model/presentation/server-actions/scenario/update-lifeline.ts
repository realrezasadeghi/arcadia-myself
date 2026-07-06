"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, ok, type IRes } from "@/modules/shared/utils/response";
import {
  UpdateScenarioLifelineUseCase,
  type UpdateScenarioLifelineResponse,
} from "@/modules/model/application/use-cases/scenario/update-lifeline";
import { scenarioLifelineRepository } from "@/modules/model/infrastructure/persistence/drizzle/repositories";
import { updateScenarioLifelineSchema, type UpdateScenarioLifelineDTO } from "@/modules/model/presentation/dtos/scenario";

export async function updateScenarioLifeline(
  payload: UpdateScenarioLifelineDTO,
): Promise<IRes<UpdateScenarioLifelineResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = updateScenarioLifelineSchema.parse(payload);

    const useCase = new UpdateScenarioLifelineUseCase(scenarioLifelineRepository);

    const response = await useCase.execute({
      payload: dto,
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}