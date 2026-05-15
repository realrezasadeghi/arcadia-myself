"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { cacheTag } from "next/cache";
import {
  type GetRelationshipsByModelIdResponse,
  GetRelationshipsByModelIdUseCase,
} from "../../application/use-cases/get-relationships-by-model-id";
import {
  modelRepository,
  relationshipRepository,
} from "../../infrastructure/persistence/drizzle/repositories";

export async function getRelationshipsByModelId(
  modelId: string,
): Promise<IRes<GetRelationshipsByModelIdResponse[]>> {
  "use cache: private";
  cacheTag("GET_RELATIONSHIPS_BY_MODEL_ID", modelId);
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    if (!modelId) {
      throw new Error("Model id is required.");
    }

    const getDiagramByIdUseCase = new GetRelationshipsByModelIdUseCase(
      modelRepository,
      relationshipRepository,
    );

    const response = await getDiagramByIdUseCase.execute({
      query: { modelId },
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
