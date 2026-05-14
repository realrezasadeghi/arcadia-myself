"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import {
  type RegisterResponse,
  RegisterUseCase,
} from "../../application/use-cases/register";
import { authRepository } from "../../infrastructure/repositories";
import { RegisterDTO, type RegisterDTOProps } from "../dtos/register";

export async function register(
  props: RegisterDTOProps,
): Promise<IRes<RegisterResponse>> {
  try {
    const dto = RegisterDTO.create(props);
    const registerUseCase = new RegisterUseCase(authRepository);
    const response = await registerUseCase.execute(dto);
    await cookiesStorageService.save("token", response.token);
    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
