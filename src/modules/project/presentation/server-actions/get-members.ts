"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import { GetProjectMembersUseCase } from "../../application/use-cases/get-members";
import { projectRepository } from "../../infrastructure/remote";

export const getProjectMembers = withAuth(
  async (payload: { projectId: number }, { token }) => {
    const getProjectMembersUseCase = new GetProjectMembersUseCase(
      projectRepository,
    );

    return getProjectMembersUseCase.execute({
      query: { projectId: payload.projectId },
      context: { token },
    });
  },
);
