"use server";

import { fail, ok } from "@/modules/shared/utils/response";
import { RegisterUseCase } from "../../application/use-cases/register";
import { authRepository } from "../../infrastructure/repositories";
import { tokenService } from "../../infrastructure/services";
import { RegisterDTO, type RegisterDTOProps } from "../dtos/register";

export async function register(props: RegisterDTOProps) {
  try {
    const dto = RegisterDTO.create(props);
    const registerUseCase = new RegisterUseCase(authRepository, tokenService);
    const response = await registerUseCase.execute(dto);
    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
