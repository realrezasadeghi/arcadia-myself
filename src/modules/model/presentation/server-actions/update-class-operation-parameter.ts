"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type UpdateClassOperationParameterUseCaseResponse,
  UpdateClassOperationParameterUseCase,
} from "../../application/use-cases/class-diagram/update-class-operation-parameter";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";
import {
  UpdateClassOperationParameterDTO,
  type UpdateClassOperationParameterDTOProps,
} from "../dtos/update-class-operation-parameter";

export const updateClassOperationParameter = withAuth(
  async (
    payload: UpdateClassOperationParameterDTOProps,
    { token },
  ): Promise<UpdateClassOperationParameterUseCaseResponse> => {
    const dto = UpdateClassOperationParameterDTO.create(payload);

    const useCase = new UpdateClassOperationParameterUseCase(
      classDiagramRepository,
    );

    const response = await useCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
