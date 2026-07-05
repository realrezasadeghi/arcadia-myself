"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import {
  type CreateClassAttributeResponse,
  CreateClassAttributeUseCase,
  RemoveClassAttributeUseCase,
  type UpdateClassAttributeResponse,
  UpdateClassAttributeUseCase,
} from "../../../application/use-cases/class-diagram/attribute";
import {
  classDiagramRepository,
  elementRepository,
} from "../../../infrastructure/persistence/drizzle/repositories";
import {
  CreateClassAttributeDTO,
  type CreateClassAttributeDTOProps,
  UpdateClassAttributeDTO,
  type UpdateClassAttributeDTOProps,
} from "../../dtos/class-diagram";

export async function createClassAttribute(
  payload: CreateClassAttributeDTOProps,
): Promise<IRes<CreateClassAttributeResponse>> {
  try {
    const token = await cookiesStorageService.get("token");
    if (!token) throw new Error("Token is required");

    const dto = CreateClassAttributeDTO.create(payload);
    const useCase = new CreateClassAttributeUseCase(
      classDiagramRepository,
      elementRepository,
    );

    const response = await useCase.execute({
      payload: dto,
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}

export async function updateClassAttribute(
  payload: UpdateClassAttributeDTOProps,
): Promise<IRes<UpdateClassAttributeResponse>> {
  try {
    const token = await cookiesStorageService.get("token");
    if (!token) throw new Error("Token is required");

    const dto = UpdateClassAttributeDTO.create(payload);
    const useCase = new UpdateClassAttributeUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: dto,
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}

export async function removeClassAttribute(id: string): Promise<IRes<void>> {
  try {
    const token = await cookiesStorageService.get("token");
    if (!token) throw new Error("Token is required");

    const useCase = new RemoveClassAttributeUseCase(classDiagramRepository);
    await useCase.execute({ payload: { id }, context: { token } });

    return ok(undefined);
  } catch (error) {
    return fail(error);
  }
}
