"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, ok, type IRes } from "@/modules/shared/utils/response";
import {
  CreateScenarioFragmentUseCase,
  type CreateScenarioFragmentResponse,
} from "@/modules/model/application/use-cases/scenario/create-fragment";
import {
  scenarioDiagramRepository,
  scenarioFragmentRepository,
} from "@/modules/model/infrastructure/persistence/drizzle/repositories";
import { createScenarioFragmentSchema, type CreateScenarioFragmentDTO } from "@/modules/model/presentation/dtos/scenario";

export async function createScenarioFragment(
  payload: CreateScenarioFragmentDTO,
): Promise<IRes<CreateScenarioFragmentResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = createScenarioFragmentSchema.parse(payload);

    const useCase = new CreateScenarioFragmentUseCase(
      scenarioFragmentRepository,
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