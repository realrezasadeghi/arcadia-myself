"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import {
  type GetClassPropertiesByElementIdUseCaseResponse,
  GetClassPropertiesByElementIdUseCase,
} from "../../application/use-cases/class-diagram/get-class-properties-by-element-id";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";

export async function getClassPropertiesByElementId(
  classElementId: string,
): Promise<IRes<GetClassPropertiesByElementIdUseCaseResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const useCase = new GetClassPropertiesByElementIdUseCase(
      classDiagramRepository,
    );

    const response = await useCase.execute({
      query: { classElementId },
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
