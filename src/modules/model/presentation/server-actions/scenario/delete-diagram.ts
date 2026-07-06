"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, ok, type IRes } from "@/modules/shared/utils/response";
import {
  DeleteScenarioDiagramUseCase,
  type DeleteScenarioDiagramResponse,
} from "@/modules/model/application/use-cases/scenario/delete-diagram";
import {
  scenarioDiagramRepository,
  scenarioLifelineRepository,
  scenarioMessageRepository,
  scenarioFragmentRepository,
} from "@/modules/model/infrastructure/persistence/drizzle/repositories";
import {
  deleteScenarioDiagramSchema,
  type DeleteScenarioDiagramDTO,
} from "@/modules/model/presentation/dtos/scenario/delete";

export async function deleteScenarioDiagram(
  payload: DeleteScenarioDiagramDTO,
): Promise<IRes<DeleteScenarioDiagramResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = deleteScenarioDiagramSchema.parse(payload);

    const useCase = new DeleteScenarioDiagramUseCase(
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
