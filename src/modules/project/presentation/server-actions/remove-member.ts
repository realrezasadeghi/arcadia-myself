"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import { RemoveProjectMemberUseCase } from "../../application/use-cases/remove-member";
import { projectRepository } from "../../infrastructure/remote";

export const removeProjectMember = withAuth(
  async (payload: { projectId: number; userId: number }, { token, userId }) => {
    // RBAC: never let a member lock themselves out of their own project.
    if (payload.userId === userId) {
      throw new Error("You cannot remove yourself from this project");
    }

    const removeProjectMemberUseCase = new RemoveProjectMemberUseCase(
      projectRepository,
    );

    const response = await removeProjectMemberUseCase.execute({
      payload,
      context: { token },
    });

    return response;
  },
  { extractUserId: true },
);
