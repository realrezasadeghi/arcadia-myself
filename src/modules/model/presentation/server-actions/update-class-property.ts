"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  UpdateClassPropertyUseCase,
  type UpdateClassPropertyUseCaseResponse,
} from "../../application/use-cases/class-diagram/update-class-property";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";
import { UpdateClassPropertyDTO, type UpdateClassPropertyDTOProps } from "../dtos/update-class-property";

export const updateClassProperty = withAuth(
  async (payload: UpdateClassPropertyDTOProps, { token }): Promise<UpdateClassPropertyUseCaseResponse> => {
    const dto = UpdateClassPropertyDTO.create(payload);

    const useCase = new UpdateClassPropertyUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
