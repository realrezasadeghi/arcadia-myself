"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type UpdateDiagramResponse,
  UpdateDiagramUseCase,
} from "../../application/use-cases/update-diagram";
import { diagramRepository } from "../../infrastructure/persistence/drizzle/repositories";
import {
  UpdateDiagramDTO,
  type UpdateDiagramDTOProps,
} from "../dtos/update-diagram";

export const updateDiagram = withAuth(
  async (payload: UpdateDiagramDTOProps, { token }): Promise<UpdateDiagramResponse> => {
    const dto = UpdateDiagramDTO.create(payload);

    const updateDiagramUseCase = new UpdateDiagramUseCase(diagramRepository);

    const response = await updateDiagramUseCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
