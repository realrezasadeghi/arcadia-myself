"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { updateTag } from "next/cache";
import { RemoveTraceLinkUseCase } from "../../application/use-cases/remove-trace-link";
import { traceLinkRepository } from "../../infrastructure/persistence/drizzle/repositories";

export async function removeTraceLink(payload: {
  id: string;
  sourceElementId: string;
  targetElementId: string;
}): Promise<IRes<boolean>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    if (!payload.id) {
      throw new Error("Trace link id is required");
    }

    const removeTraceLinkUseCase = new RemoveTraceLinkUseCase(
      traceLinkRepository,
    );

    const response = await removeTraceLinkUseCase.execute({
      payload: { id: payload.id },
      context: { token },
    });

    updateTag(`get-trace-links-by-element-id-${payload.sourceElementId}`);

    updateTag(`get-trace-links-by-element-id-${payload.targetElementId}`);

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}
