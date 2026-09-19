"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { userRepository } from "../../infrastructure/repositories";

export async function logout(): Promise<IRes<void>> {
  try {
    const token = await cookiesStorageService.get("token");
    if (!token) {
      throw new Error("Token is required");
    }
    await userRepository.logout({ token });
    return ok(undefined as void);
  } catch (error) {
    return fail(error);
  }
}
