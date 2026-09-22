"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import { UpdateProjectMemberRoleUseCase } from "../../application/use-cases/update-member-role";
import { projectRepository } from "../../infrastructure/remote";
import {
  UpdateProjectMemberRoleDTO,
  type UpdateProjectMemberRoleDTOProps,
} from "../dtos/update-member-role";

export const updateProjectMemberRole = withAuth(
  async (payload: UpdateProjectMemberRoleDTOProps, { token }) => {
    const dto = UpdateProjectMemberRoleDTO.create(payload);

    const updateProjectMemberRoleUseCase = new UpdateProjectMemberRoleUseCase(
      projectRepository,
    );

    const response = await updateProjectMemberRoleUseCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
