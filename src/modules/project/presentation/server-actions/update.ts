"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import { UpdateProjectUseCase } from "../../application/use-cases/update";
import { projectRepository } from "../../infrastructure/remote";
import { UpdateProjectDTO, type UpdateProjectDTOProps } from "../dtos/update";

export const update = withAuth(
  async (payload: UpdateProjectDTOProps, { token, userId }) => {
    const dto = UpdateProjectDTO.create(payload);

    const updateProjectUseCase = new UpdateProjectUseCase(projectRepository);

    const response = await updateProjectUseCase.execute({
      payload: dto,
      context: {
        token,
        userId,
        requesterId: userId,
      },
    });

    return response;
  },
  { extractUserId: true },
);
