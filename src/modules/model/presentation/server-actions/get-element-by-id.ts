"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { cacheTag } from "next/cache";
import {
  type GetElementByIdResponse,
  GetElementByIdUseCase,
} from "../../application/use-cases/get-element-by-id";
import { elementRepository } from "../../infrastructure/persistence/drizzle/repositories";

export async function getElementById(
  id: string,
): Promise<IRes<GetElementByIdResponse>> {
  "use cache: private";
  cacheTag(`get-element-by-id-${id}`);
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    if (!id) {
      throw new Error("Element id is required.");
    }

    const getElementByIdUseCase = new GetElementByIdUseCase(elementRepository);

    const response = await getElementByIdUseCase.execute({
      query: { id },
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
