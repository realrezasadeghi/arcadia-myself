"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type CreateClassOperationParameterUseCaseResponse,
  CreateClassOperationParameterUseCase,
} from "../../application/use-cases/class-diagram/create-class-operation-parameter";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";
import { CreateClassOperationParameterDTO, type CreateClassOperationParameterDTOProps } from "../dtos/create-class-operation-parameter";

export const createClassOperationParameter = withAuth(
  async (payload: CreateClassOperationParameterDTOProps, { token }): Promise<CreateClassOperationParameterUseCaseResponse> => {
    const dto = CreateClassOperationParameterDTO.create(payload);

    const useCase = new CreateClassOperationParameterUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
