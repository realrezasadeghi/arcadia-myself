"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, ok, type IRes } from "@/modules/shared/utils/response";
import {
  DeleteScenarioMessageUseCase,
  type DeleteScenarioMessageResponse,
} from "@/modules/model/application/use-cases/scenario/delete-message";
import {
  scenarioMessageRepository,
  scenarioFragmentRepository,
} from "@/modules/model/infrastructure/persistence/drizzle/repositories";
import {
  deleteScenarioMessageSchema,
  type DeleteScenarioMessageDTO,
} from "@/modules/model/presentation/dtos/scenario/delete";

export async function deleteScenarioMessage(
  payload: DeleteScenarioMessageDTO,
): Promise<IRes<DeleteScenarioMessageResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = deleteScenarioMessageSchema.parse(payload);

    const useCase = new DeleteScenarioMessageUseCase(
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
