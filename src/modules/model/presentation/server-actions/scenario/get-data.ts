"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, ok, type IRes } from "@/modules/shared/utils/response";
import {
  GetScenarioDataUseCase,
  type GetScenarioDataResponse,
} from "@/modules/model/application/use-cases/scenario/get-data";
import {
  scenarioDiagramRepository,
  scenarioLifelineRepository,
  scenarioMessageRepository,
  scenarioFragmentRepository,
} from "@/modules/model/infrastructure/persistence/drizzle/repositories";
import { getScenarioDataSchema, type GetScenarioDataDTO } from "@/modules/model/presentation/dtos/scenario";

export async function getScenarioData(
  payload: GetScenarioDataDTO,
): Promise<IRes<GetScenarioDataResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = getScenarioDataSchema.parse(payload);

    const useCase = new GetScenarioDataUseCase(
      scenarioDiagramRepository,
      scenarioLifelineRepository,
      scenarioMessageRepository,
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