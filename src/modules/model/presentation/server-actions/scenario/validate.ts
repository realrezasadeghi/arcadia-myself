"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, ok, type IRes } from "@/modules/shared/utils/response";
import {
  ValidateScenarioUseCase,
  type ValidateScenarioResponse,
} from "@/modules/model/application/use-cases/scenario/validate";
import { scenarioDiagramRepository } from "@/modules/model/infrastructure/persistence/drizzle/repositories";
import { validateScenarioSchema, type ValidateScenarioDTO } from "@/modules/model/presentation/dtos/scenario";

export async function validateScenario(
  payload: ValidateScenarioDTO,
): Promise<IRes<ValidateScenarioResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = validateScenarioSchema.parse(payload);

    const useCase = new ValidateScenarioUseCase(scenarioDiagramRepository);

    const response = await useCase.execute({
      payload: dto,
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}