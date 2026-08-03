"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";

export type GetClassOperationParametersByOperationIdResponse = Array<{
  id: string;
  classOperationId: string;
  modelId: string;
  layer: string;
  name: string;
  typeClassElementId: string | null;
  multiplicityLower: number;
  multiplicityUpper: string;
  defaultValue: string | null;
  direction: string;
  isOrdered: boolean;
  isUnique: boolean;
  ordering: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}>;

export async function getClassOperationParametersByOperationId(
  classOperationId: string,
): Promise<IRes<GetClassOperationParametersByOperationIdResponse>> {
  try {
    const token = await cookiesStorageService.get("token");
    if (!token) throw new Error("Token is required");

    const result = await classDiagramRepository.findParametersByOperationId({
      classOperationId,
    });

    return ok(result.map((p) => p.toJSON()));
  } catch (error) {
    return fail(error);
  }
}
