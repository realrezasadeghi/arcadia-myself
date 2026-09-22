"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import { RemoveProjectMemberUseCase } from "../../application/use-cases/remove-member";
import { projectRepository } from "../../infrastructure/remote";

export const removeProjectMember = withAuth(
  async (payload: { projectId: number; userId: number }, { token }) => {
    const removeProjectMemberUseCase = new RemoveProjectMemberUseCase(
      projectRepository,
    );

    const response = await removeProjectMemberUseCase.execute({
      payload,
      context: { token },
    });

    return response;
  },
);
