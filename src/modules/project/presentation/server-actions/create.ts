"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import {
  type CreateProjectResponse,
  CreateProjectUseCase,
} from "../../application/use-cases/create";
import { projectRepository } from "../../infrastructure/remote";
import { CreateProjectDTO, type CreateProjectDTOProps } from "../dtos/create";

export const create = withAuth(
  async (payload: CreateProjectDTOProps, { token, userId }): Promise<CreateProjectResponse> => {
    const dto = CreateProjectDTO.create(payload);

    const createProjectUseCase = new CreateProjectUseCase(projectRepository);

    const response = await createProjectUseCase.execute({
      payload: dto,
      context: {
        token,
        userId,
      },
    });

    return response;
  },
  { extractUserId: true },
);
