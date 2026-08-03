"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type UpdateClassOperationUseCaseResponse,
  UpdateClassOperationUseCase,
} from "../../application/use-cases/class-diagram/update-class-operation";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";
import { UpdateClassOperationDTO, type UpdateClassOperationDTOProps } from "../dtos/update-class-operation";

export const updateClassOperation = withAuth(
  async (payload: UpdateClassOperationDTOProps, { token }): Promise<UpdateClassOperationUseCaseResponse> => {
    const dto = UpdateClassOperationDTO.create(payload);

    const useCase = new UpdateClassOperationUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
