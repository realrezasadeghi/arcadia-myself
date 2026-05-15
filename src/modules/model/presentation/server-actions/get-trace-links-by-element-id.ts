"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { cacheTag } from "next/cache";
import {
  type GetTraceLinksByElementIdResponse,
  GetTraceLinksByElementIdUseCase,
} from "../../application/use-cases/get-trace-links-by-element-id";
import {
  elementRepository,
  traceLinkRepository,
} from "../../infrastructure/persistence/drizzle/repositories";

export async function getTraceLinksByElementsId(
  elementId: string,
): Promise<IRes<GetTraceLinksByElementIdResponse[]>> {
  "use cache: private";
  cacheTag("GET_TRACE_LINKS_BY_ELEMENT_ID", elementId);
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    if (!elementId) {
      throw new Error("Element id is required.");
    }

    const getTraceLinksByElementIdUseCase = new GetTraceLinksByElementIdUseCase(
      traceLinkRepository,
      elementRepository,
    );

    const response = await getTraceLinksByElementIdUseCase.execute({
      query: { elementId },
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
