import type { IRes } from "@/modules/shared/utils/response";

type Project = {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
};

export type GetProjectByIdQuery = {
  id: number;
};

export type GetProjectByIdResponse = Project;

export type GetAllProjectsResponse = Project[];

export type CreateProjectPayload = {
  name: string;
  description?: string;
};

export type CreateProjectsResponse = Project;

export type UpdateProjectPayload = {
  id: number;
  name: string;
  description?: string;
};

export type UpdateProjectsResponse = Project;

export type RemoveProjectPayload = {
  id: number;
};

export interface IProjectRepository {
  getProjectById(
    query: GetProjectByIdQuery,
    token: string,
  ): Promise<IRes<GetProjectByIdResponse>>;

  getAllProjects(token: string): Promise<IRes<GetAllProjectsResponse>>;

  create(
    payload: CreateProjectPayload,
    token: string,
  ): Promise<IRes<CreateProjectsResponse>>;

  update(
    payload: UpdateProjectPayload,
    token: string,
  ): Promise<IRes<UpdateProjectsResponse>>;

  remove(payload: RemoveProjectPayload, token: string): Promise<IRes<void>>;
}
