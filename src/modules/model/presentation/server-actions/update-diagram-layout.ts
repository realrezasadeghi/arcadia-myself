"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type UpdateDiagramLayoutResponse,
  UpdateDiagramLayoutUseCase,
} from "../../application/use-cases/update-diagram-layout";
import { diagramRepository } from "../../infrastructure/persistence/drizzle/repositories";
import {
  UpdateDiagramLayoutDTO,
  type UpdateDiagramLayoutDTOProps,
} from "../dtos/update-diagram-layout";

export const updateDiagramLayout = withAuth(
  async (
    payload: UpdateDiagramLayoutDTOProps,
    { token },
  ): Promise<UpdateDiagramLayoutResponse> => {
    const dto = UpdateDiagramLayoutDTO.create(payload);
    const updateDiagramLayoutUseCase = new UpdateDiagramLayoutUseCase(
      diagramRepository,
    );

    const response = await updateDiagramLayoutUseCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
