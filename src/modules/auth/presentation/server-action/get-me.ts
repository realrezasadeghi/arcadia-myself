"use server";

import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import {
  type GetMeResponse,
  GetMeUseCase,
} from "../../application/use-cases/get-me";
import { userRepository } from "../../infrastructure/repositories";
import { cookieTokenService } from "../../infrastructure/services";

export async function getMe(): Promise<IRes<GetMeResponse>> {
  try {
    const useCase = new GetMeUseCase(userRepository, cookieTokenService);
    const response = await useCase.execute();
    console.log("res", response);
    return ok(response);
  } catch (error) {
    console.log("error", error);
    return fail(error);
  }
}
