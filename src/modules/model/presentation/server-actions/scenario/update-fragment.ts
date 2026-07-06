"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, ok, type IRes } from "@/modules/shared/utils/response";
import {
  UpdateScenarioFragmentUseCase,
  type UpdateScenarioFragmentResponse,
} from "@/modules/model/application/use-cases/scenario/update-fragment";
import { scenarioFragmentRepository } from "@/modules/model/infrastructure/persistence/drizzle/repositories";
import { updateScenarioFragmentSchema, type UpdateScenarioFragmentDTO } from "@/modules/model/presentation/dtos/scenario";

export async function updateScenarioFragment(
  payload: UpdateScenarioFragmentDTO,
): Promise<IRes<UpdateScenarioFragmentResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = updateScenarioFragmentSchema.parse(payload);

    const useCase = new UpdateScenarioFragmentUseCase(scenarioFragmentRepository);

    const response = await useCase.execute({
      payload: dto,
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}