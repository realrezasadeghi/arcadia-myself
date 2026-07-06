"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, ok, type IRes } from "@/modules/shared/utils/response";
import {
  DeleteScenarioFragmentUseCase,
  type DeleteScenarioFragmentResponse,
} from "@/modules/model/application/use-cases/scenario/delete-fragment";
import {
  scenarioFragmentRepository,
  scenarioMessageRepository,
} from "@/modules/model/infrastructure/persistence/drizzle/repositories";
import {
  deleteScenarioFragmentSchema,
  type DeleteScenarioFragmentDTO,
} from "@/modules/model/presentation/dtos/scenario/delete";

export async function deleteScenarioFragment(
  payload: DeleteScenarioFragmentDTO,
): Promise<IRes<DeleteScenarioFragmentResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = deleteScenarioFragmentSchema.parse(payload);

    const useCase = new DeleteScenarioFragmentUseCase(
      scenarioFragmentRepository,
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
