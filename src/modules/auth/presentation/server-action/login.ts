"use server";

import { fail, ok } from "@/modules/shared/utils/response";
import type { LoginDTOProps } from "../../application/dtos/login";
import { LoginUseCase } from "../../application/use-cases/login";
import { authRepository } from "../../infrastructure/repositories";
import { tokenService } from "../../infrastructure/services";

export async function login(props: LoginDTOProps) {
  try {
    const loginUseCase = new LoginUseCase(authRepository, tokenService);
    const response = await loginUseCase.execute(props);
    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
