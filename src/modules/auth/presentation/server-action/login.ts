"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import {
  type LoginResponse,
  LoginUseCase,
} from "../../application/use-cases/login";
import { authRepository } from "../../infrastructure/repositories";
import { LoginDTO, type LoginDTOProps } from "../dtos/login";

export async function login(
  props: LoginDTOProps,
): Promise<IRes<LoginResponse>> {
  try {
    const dto = LoginDTO.create(props);
    const loginUseCase = new LoginUseCase(authRepository);
    const response = await loginUseCase.execute(dto);
    await cookiesStorageService.save("token", response.token);
    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
