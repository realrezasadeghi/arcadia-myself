"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, ok, type IRes } from "@/modules/shared/utils/response";
import {
  UpdateScenarioLayoutUseCase,
  type UpdateScenarioLayoutResponse,
} from "@/modules/model/application/use-cases/scenario/update-layout";
import {
  scenarioDiagramRepository,
  scenarioLifelineRepository,
  scenarioFragmentRepository,
} from "@/modules/model/infrastructure/persistence/drizzle/repositories";
import {
  updateScenarioLayoutSchema,
  type UpdateScenarioLayoutDTO,
} from "@/modules/model/presentation/dtos/scenario/delete";

export async function updateScenarioLayout(
  payload: UpdateScenarioLayoutDTO,
): Promise<IRes<UpdateScenarioLayoutResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = updateScenarioLayoutSchema.parse(payload);

    const useCase = new UpdateScenarioLayoutUseCase(
      scenarioDiagramRepository,
      scenarioLifelineRepository,
      scenarioFragmentRepository,
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
