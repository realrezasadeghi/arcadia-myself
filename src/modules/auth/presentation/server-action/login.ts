"use server";

import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import {
  type LoginResponse,
  LoginUseCase,
} from "../../application/use-cases/login";
import { authRepository } from "../../infrastructure/repositories";
import { cookieTokenService } from "../../infrastructure/services";
import { LoginDTO, type LoginDTOProps } from "../dtos/login";

export async function login(
  props: LoginDTOProps,
): Promise<IRes<LoginResponse>> {
  try {
    const dto = LoginDTO.create(props);
    const loginUseCase = new LoginUseCase(authRepository, cookieTokenService);
    const response = await loginUseCase.execute(dto);
    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
