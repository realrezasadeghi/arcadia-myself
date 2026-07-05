"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import {
  type CreateClassAssociationResponse,
  CreateClassAssociationUseCase,
  RemoveClassAssociationUseCase,
  type UpdateClassAssociationResponse,
  UpdateClassAssociationUseCase,
} from "../../../application/use-cases/class-diagram/association";
import {
  classDiagramRepository,
  elementRepository,
} from "../../../infrastructure/persistence/drizzle/repositories";
import {
  CreateClassAssociationDTO,
  type CreateClassAssociationDTOProps,
  UpdateClassAssociationDTO,
  type UpdateClassAssociationDTOProps,
} from "../../dtos/class-diagram";

export async function createClassAssociation(
  payload: CreateClassAssociationDTOProps,
): Promise<IRes<CreateClassAssociationResponse>> {
  try {
    const token = await cookiesStorageService.get("token");
    if (!token) throw new Error("Token is required");

    const dto = CreateClassAssociationDTO.create(payload);
    const useCase = new CreateClassAssociationUseCase(
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

export async function updateClassAssociation(
  payload: UpdateClassAssociationDTOProps,
): Promise<IRes<UpdateClassAssociationResponse>> {
  try {
    const token = await cookiesStorageService.get("token");
    if (!token) throw new Error("Token is required");

    const dto = UpdateClassAssociationDTO.create(payload);
    const useCase = new UpdateClassAssociationUseCase(classDiagramRepository);

    const response = await useCase.execute({
      payload: dto,
      context: { token },
    });

    return ok(response);
  } catch (error) {
    return fail(error);
  }
}

export async function removeClassAssociation(id: string): Promise<IRes<void>> {
  try {
    const token = await cookiesStorageService.get("token");
    if (!token) throw new Error("Token is required");

    const useCase = new RemoveClassAssociationUseCase(classDiagramRepository);
    await useCase.execute({ payload: { id }, context: { token } });

    return ok(undefined);
  } catch (error) {
    return fail(error);
  }
}
