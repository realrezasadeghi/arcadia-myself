"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { updateTag } from "next/cache";
import {
  type GetClassDiagramByIdUseCaseResponse,
  GetClassDiagramByIdUseCase,
} from "../../application/use-cases/class-diagram/get-class-diagram-by-id";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";

export async function getClassDiagramById(
  id: string,
): Promise<IRes<GetClassDiagramByIdUseCaseResponse>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    const useCase = new GetClassDiagramByIdUseCase(classDiagramRepository);

    const response = await useCase.execute({
      query: { id },
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
