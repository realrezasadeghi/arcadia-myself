"use server";

import { fail, ok } from "@/modules/shared/utils/response";
import type { RegisterDTOProps } from "../../application/dtos/register";
import { RegisterUseCase } from "../../application/use-cases/register";
import { authRepository } from "../../infrastructure/repositories";
import { tokenService } from "../../infrastructure/services";

export async function register(props: RegisterDTOProps) {
  try {
    const registerUseCase = new RegisterUseCase(authRepository, tokenService);
    const response = await registerUseCase.execute(props);
    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
