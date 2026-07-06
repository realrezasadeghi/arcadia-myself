"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, ok, type IRes } from "@/modules/shared/utils/response";
import {
  ReorderScenarioMessagesUseCase,
  type ReorderScenarioMessagesResponse,
} from "@/modules/model/application/use-cases/scenario/reorder-messages";
import { scenarioDiagramRepository } from "@/modules/model/infrastructure/persistence/drizzle/repositories";
import { reorderScenarioMessagesSchema, type ReorderScenarioMessagesDTO } from "@/modules/model/presentation/dtos/scenario";

export async function reorderScenarioMessages(
  payload: ReorderScenarioMessagesDTO,
): Promise<{ success: boolean; data?: ReorderScenarioMessagesResponse; error?: string }> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = reorderScenarioMessagesSchema.parse(payload);

    const useCase = new ReorderScenarioMessagesUseCase(scenarioDiagramRepository);

    const response = await useCase.execute({
      payload: dto,
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}