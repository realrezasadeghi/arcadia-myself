"use server";

import { updateTag } from "next/cache";
import {
  type UpdateMeResponse,
  UpdateMeUseCase,
} from "../../application/use-cases/update-me";
import { userRepository } from "../../infrastructure/repositories";
import { UpdateMeDTO, type UpdateMeDTOProps } from "../dtos/update-me";
import { withAuth } from "../with-auth";

export const updateMe = withAuth(
  async (payload: UpdateMeDTOProps, { token }): Promise<UpdateMeResponse> => {
    const dto = UpdateMeDTO.create(payload);
    const useCase = new UpdateMeUseCase(userRepository);
    const response = await useCase.execute({
      token,
      name: dto.name,
    });
    updateTag("GET_ME");
    return response;
  },
);
