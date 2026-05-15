"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { cacheTag } from "next/cache";
import {
  type GetTraceLinksByProjectIdResponse,
  GetTraceLinksByProjectIdUseCase,
} from "../../application/use-cases/get-trace-links-by-project-id";
import { traceLinkRepository } from "../../infrastructure/persistence/drizzle/repositories";

export async function getTraceLinksByProjectId(
  projectId: string,
): Promise<IRes<GetTraceLinksByProjectIdResponse[]>> {
  "use cache: private";
  cacheTag("GET_TRACE_LINKS_BY_PROJECT_ID", projectId);
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    if (!projectId) {
      throw new Error("Project id is required.");
    }

    const getTraceLinksByElementIdUseCase = new GetTraceLinksByProjectIdUseCase(
      traceLinkRepository,
    );

    const response = await getTraceLinksByElementIdUseCase.execute({
      query: { projectId },
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
