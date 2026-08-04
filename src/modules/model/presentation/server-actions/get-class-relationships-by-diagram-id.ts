"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import {
  type GetClassRelationshipsByModelIdUseCaseResponse,
  GetClassRelationshipsByModelIdUseCase,
} from "../../application/use-cases/class-diagram/get-class-relationships-by-model-id";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";

export async function getClassRelationshipsByDiagramId(
  modelId: string,
  layer?: string,
): Promise<IRes<GetClassRelationshipsByModelIdUseCaseResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const useCase = new GetClassRelationshipsByModelIdUseCase(
      classDiagramRepository,
    );

    const response = await useCase.execute({
      query: { modelId, layer },
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
