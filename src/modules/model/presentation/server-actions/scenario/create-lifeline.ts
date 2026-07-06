"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, ok, type IRes } from "@/modules/shared/utils/response";
import {
  CreateScenarioLifelineUseCase,
  type CreateScenarioLifelineResponse,
} from "@/modules/model/application/use-cases/scenario/create-lifeline";
import {
  scenarioDiagramRepository,
  scenarioLifelineRepository,
} from "@/modules/model/infrastructure/persistence/drizzle/repositories";
import { createScenarioLifelineSchema, type CreateScenarioLifelineDTO } from "@/modules/model/presentation/dtos/scenario";

export async function createScenarioLifeline(
  payload: CreateScenarioLifelineDTO,
): Promise<IRes<CreateScenarioLifelineResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = createScenarioLifelineSchema.parse(payload);

    const useCase = new CreateScenarioLifelineUseCase(
      scenarioLifelineRepository,
      scenarioDiagramRepository,
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