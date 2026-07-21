"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import {
  type GetClassEnumerationLiteralsByElementIdUseCaseResponse,
  GetClassEnumerationLiteralsByElementIdUseCase,
} from "../../application/use-cases/class-diagram/get-class-enumeration-literals-by-element-id";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";

export async function getClassEnumerationLiteralsByElementId(
  classElementId: string,
): Promise<IRes<GetClassEnumerationLiteralsByElementIdUseCaseResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const useCase = new GetClassEnumerationLiteralsByElementIdUseCase(classDiagramRepository);

    const response = await useCase.execute({
      query: { classElementId },
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
