"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import {
  type CreateClassOperationResponse,
  CreateClassOperationUseCase,
  RemoveClassOperationUseCase,
  type UpdateClassOperationResponse,
  UpdateClassOperationUseCase,
} from "../../../application/use-cases/class-diagram/operation";
import {
  classDiagramRepository,
  elementRepository,
} from "../../../infrastructure/persistence/drizzle/repositories";
import {
  CreateClassOperationDTO,
  type CreateClassOperationDTOProps,
  UpdateClassOperationDTO,
  type UpdateClassOperationDTOProps,
} from "../../dtos/class-diagram";

export async function createClassOperation(
  payload: CreateClassOperationDTOProps,
): Promise<IRes<CreateClassOperationResponse>> {
  try {
    const token = await cookiesStorageService.get("token");
    if (!token) throw new Error("Token is required");

    const dto = CreateClassOperationDTO.create(payload);
    const useCase = new CreateClassOperationUseCase(
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

export async function updateClassOperation(
  payload: UpdateClassOperationDTOProps,
): Promise<IRes<UpdateClassOperationResponse>> {
  try {
    const token = await cookiesStorageService.get("token");
    if (!token) throw new Error("Token is required");

    const dto = UpdateClassOperationDTO.create(payload);
    const useCase = new UpdateClassOperationUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: dto,
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}

export async function removeClassOperation(id: string): Promise<IRes<void>> {
  try {
    const token = await cookiesStorageService.get("token");
    if (!token) throw new Error("Token is required");

    const useCase = new RemoveClassOperationUseCase(classDiagramRepository);
    await useCase.execute({ payload: { id }, context: { token } });

    return ok(undefined);
  } catch (error) {
    return fail(error);
  }
}
