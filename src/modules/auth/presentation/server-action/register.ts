"use server";

import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import {
  type RegisterResponse,
  RegisterUseCase,
} from "../../application/use-cases/register";
import { authRepository } from "../../infrastructure/repositories";
import { cookieTokenService } from "../../infrastructure/services";
import { RegisterDTO, type RegisterDTOProps } from "../dtos/register";

export async function register(
  props: RegisterDTOProps,
): Promise<IRes<RegisterResponse>> {
  try {
    const dto = RegisterDTO.create(props);
    const registerUseCase = new RegisterUseCase(authRepository, cookieTokenService);
    const response = await registerUseCase.execute(dto);
    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
