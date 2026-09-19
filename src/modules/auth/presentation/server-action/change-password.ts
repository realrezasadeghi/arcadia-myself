"use server";

import {
  type ChangePasswordResponse,
  ChangePasswordUseCase,
} from "../../application/use-cases/change-password";
import { userRepository } from "../../infrastructure/repositories";
import {
  ChangePasswordDTO,
  type ChangePasswordDTOProps,
} from "../dtos/change-password";
import { withAuth } from "../with-auth";

export const changePassword = withAuth(
  async (
    payload: ChangePasswordDTOProps,
    { token },
  ): Promise<ChangePasswordResponse> => {
    const dto = ChangePasswordDTO.create(payload);
    const useCase = new ChangePasswordUseCase(userRepository);
    const response = await useCase.execute({
      token,
      current_password: dto.current_password,
      password: dto.password,
      password_confirmation: dto.password_confirmation,
    });
    return response;
  },
);
