"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, ok, type IRes } from "@/modules/shared/utils/response";
import {
  DeleteScenarioLifelineUseCase,
  type DeleteScenarioLifelineResponse,
} from "@/modules/model/application/use-cases/scenario/delete-lifeline";
import {
  scenarioLifelineRepository,
  scenarioMessageRepository,
} from "@/modules/model/infrastructure/persistence/drizzle/repositories";
import {
  deleteScenarioLifelineSchema,
  type DeleteScenarioLifelineDTO,
} from "@/modules/model/presentation/dtos/scenario/delete";

export async function deleteScenarioLifeline(
  payload: DeleteScenarioLifelineDTO,
): Promise<IRes<DeleteScenarioLifelineResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = deleteScenarioLifelineSchema.parse(payload);

    const useCase = new DeleteScenarioLifelineUseCase(
      scenarioLifelineRepository,
      scenarioMessageRepository,
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
