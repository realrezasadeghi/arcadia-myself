"use server";
import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { cacheTag } from "next/cache";
import {
  type GetDiagramByIdResponse,
  GetDiagramByIdUseCase,
} from "../../application/use-cases/get-diagram-by-id";
import { diagramRepository } from "../../infrastructure/persistence/drizzle/repositories";

export async function getDiagramById(
  id: string,
): Promise<IRes<GetDiagramByIdResponse>> {
  "use cache: private";
  cacheTag(`get-diagram-by-id-${id}`);
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    if (!id) {
      throw new Error("Diagram id is required.");
    }

    const getDiagramByIdUseCase = new GetDiagramByIdUseCase(diagramRepository);

    const response = await getDiagramByIdUseCase.execute({
      query: { id },
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
