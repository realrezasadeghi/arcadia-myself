"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { cacheTag } from "next/cache";
import {
  type GetMeResponse,
  GetMeUseCase,
} from "../../application/use-cases/get-me";
import { userRepository } from "../../infrastructure/repositories";

export async function getMe(): Promise<IRes<GetMeResponse>> {
  "use cache: private";

  cacheTag("GET_ME");
  try {
    const token = await cookiesStorageService.get("token");
    if (!token) {
      throw new Error("Token is required");
    }
    const useCase = new GetMeUseCase(userRepository);
    const response = await useCase.execute({ token });
    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
