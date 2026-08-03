"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type UpdateClassRelationshipUseCaseResponse,
  UpdateClassRelationshipUseCase,
} from "../../application/use-cases/class-diagram/update-class-relationship";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";
import {
  UpdateClassRelationshipDTO,
  type UpdateClassRelationshipDTOProps,
} from "../dtos/update-class-relationship";

export const updateClassRelationship = withAuth(
  async (payload: UpdateClassRelationshipDTOProps, { token }): Promise<UpdateClassRelationshipUseCaseResponse> => {
    const dto = UpdateClassRelationshipDTO.create(payload);

    const useCase = new UpdateClassRelationshipUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
