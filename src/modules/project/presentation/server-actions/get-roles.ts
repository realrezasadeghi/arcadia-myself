"use server";

import { withAuthNoPayload } from "@/modules/auth/presentation/with-auth";
import { GetProjectRolesUseCase } from "../../application/use-cases/get-roles";
import { projectRepository } from "../../infrastructure/remote";

export const getProjectRoles = withAuthNoPayload(async ({ token }) => {
  const getProjectRolesUseCase = new GetProjectRolesUseCase(projectRepository);

  return getProjectRolesUseCase.execute({
    context: { token },
  });
});
