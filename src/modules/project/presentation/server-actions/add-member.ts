"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import { AddProjectMemberUseCase } from "../../application/use-cases/add-member";
import { projectRepository } from "../../infrastructure/remote";
import {
  AddProjectMemberDTO,
  type AddProjectMemberDTOProps,
} from "../dtos/add-member";

export const addProjectMember = withAuth(
  async (payload: AddProjectMemberDTOProps, { token }) => {
    const dto = AddProjectMemberDTO.create(payload);

    const addProjectMemberUseCase = new AddProjectMemberUseCase(
      projectRepository,
    );

    const response = await addProjectMemberUseCase.execute({
      payload: dto,
      context: { token },
    });

    return response;
  },
);
