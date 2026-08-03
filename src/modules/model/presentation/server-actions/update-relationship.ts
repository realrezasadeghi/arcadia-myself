"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type UpdateRelationshipResponse,
  UpdateRelationshipUseCase,
} from "../../application/use-cases/update-relationship";
import { relationshipRepository } from "../../infrastructure/persistence/drizzle/repositories";
import {
  UpdateRelationshipDTO,
  type UpdateRelationshipDTOProps,
} from "../dtos/update-relationship";

export const updateRelationship = withAuth(
  async (payload: UpdateRelationshipDTOProps, { token }): Promise<UpdateRelationshipResponse> => {
    const dto = UpdateRelationshipDTO.create(payload);

    const updateRelationshipUseCase = new UpdateRelationshipUseCase(
      relationshipRepository,
    );

    const response = await updateRelationshipUseCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
