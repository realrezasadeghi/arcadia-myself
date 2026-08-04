"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type CreateClassRelationshipUseCaseResponse,
  CreateClassRelationshipUseCase,
} from "../../application/use-cases/class-diagram/create-class-relationship";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";
import {
  CreateClassRelationshipDTO,
  type CreateClassRelationshipDTOProps,
} from "../dtos/create-class-relationship";

export const createClassRelationship = withAuth(
  async (
    payload: CreateClassRelationshipDTOProps,
    { token },
  ): Promise<CreateClassRelationshipUseCaseResponse> => {
    const dto = CreateClassRelationshipDTO.create(payload);

    const useCase = new CreateClassRelationshipUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
