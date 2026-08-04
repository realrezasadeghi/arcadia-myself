"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type UpdateClassEnumerationLiteralUseCaseResponse,
  UpdateClassEnumerationLiteralUseCase,
} from "../../application/use-cases/class-diagram/update-class-enumeration-literal";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";
import {
  UpdateClassEnumerationLiteralDTO,
  type UpdateClassEnumerationLiteralDTOProps,
} from "../dtos/update-class-enumeration-literal";

export const updateClassEnumerationLiteral = withAuth(
  async (
    payload: UpdateClassEnumerationLiteralDTOProps,
    { token },
  ): Promise<UpdateClassEnumerationLiteralUseCaseResponse> => {
    const dto = UpdateClassEnumerationLiteralDTO.create(payload);

    const useCase = new UpdateClassEnumerationLiteralUseCase(
      classDiagramRepository,
    );

    const response = await useCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
