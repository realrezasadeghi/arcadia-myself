"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type UpdateClassElementUseCaseResponse,
  UpdateClassElementUseCase,
} from "../../application/use-cases/class-diagram/update-class-element";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";
import { UpdateClassElementDTO, type UpdateClassElementDTOProps } from "../dtos/update-class-element";

export const updateClassElement = withAuth(
  async (payload: UpdateClassElementDTOProps, { token }): Promise<UpdateClassElementUseCaseResponse> => {
    const dto = UpdateClassElementDTO.create(payload);

    const useCase = new UpdateClassElementUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
