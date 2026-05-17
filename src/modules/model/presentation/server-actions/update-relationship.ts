"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import {
  type UpdateRelationshipResponse,
  UpdateRelationshipUseCase,
} from "../../application/use-cases/update-relationship";
import { relationshipRepository } from "../../infrastructure/persistence/drizzle/repositories";
import {
  UpdateRelationshipDTO,
  type UpdateRelationshipDTOProps,
} from "../dtos/update-relationship";

export async function updateRelationship(
  payload: UpdateRelationshipDTOProps,
): Promise<IRes<UpdateRelationshipResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const dto = UpdateRelationshipDTO.create(payload);

    const updateRelationshipUseCase = new UpdateRelationshipUseCase(
      relationshipRepository,
    );

    const response = await updateRelationshipUseCase.execute({
      payload: dto,
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
