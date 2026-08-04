"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type CreateClassElementUseCaseResponse,
  CreateClassElementUseCase,
} from "../../application/use-cases/class-diagram/create-class-element";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";
import {
  CreateClassElementDTO,
  type CreateClassElementDTOProps,
} from "../dtos/create-class-element";

export const createClassElement = withAuth(
  async (
    payload: CreateClassElementDTOProps,
    { token },
  ): Promise<CreateClassElementUseCaseResponse> => {
    const dto = CreateClassElementDTO.create(payload);

    const useCase = new CreateClassElementUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
