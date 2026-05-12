"use server";

import { fail, ok } from "@/modules/shared/utils/response";
import { LoginUseCase } from "../../application/use-cases/login";
import { authRepository } from "../../infrastructure/repositories";
import { tokenService } from "../../infrastructure/services";
import { LoginDTO, type LoginDTOProps } from "../dtos/login";

export async function login(props: LoginDTOProps) {
  try {
    console.log("props", props);
    const dto = LoginDTO.create(props);
    const loginUseCase = new LoginUseCase(authRepository, tokenService);
    const response = await loginUseCase.execute(dto);
    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
