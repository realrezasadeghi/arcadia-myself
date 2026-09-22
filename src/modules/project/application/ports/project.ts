import type { IRes } from "@/modules/shared/utils/response";
import type {
  ProjectPermission,
  ProjectRoleDefinition,
} from "../../domain/constants/permissions";
import type { ProjectRoleName } from "../../domain/value-objects/project-role";

export type Project = {
  id: number;
  name: string;
  description?: string;
  created_by: number;
  role?: string;
  roles?: string[];
  permissions?: string[];
  created_at: string;
  updated_at: string;
};

export type GetProjectByIdQuery = { id: number };
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

export type RemoveProjectPayload = { id: number };

// ─── RBAC: roles ────────────────────────────────────────────────────────────

export type GetProjectRolesResponse = ProjectRoleDefinition[];

// ─── RBAC: members ──────────────────────────────────────────────────────────

export type ProjectMemberData = {
  userId: number;
  name: string;
  username: string;
  /** All roles held by the member (multi-role union model). */
  roles: ProjectRoleName[];
  /** Primary role for single-role display contexts (roles[0]). */
  role: ProjectRoleName;
  permissions: ProjectPermission[];
  joinedAt: string;
};

export type GetProjectMembersQuery = { projectId: number };
export type GetProjectMembersResponse = ProjectMemberData[];

export type AddProjectMemberPayload = {
  projectId: number;
  username: string;
  roles: ProjectRoleName[];
};
export type AddProjectMemberResponse = ProjectMemberData;

export type UpdateProjectMemberRolePayload = {
  projectId: number;
  userId: number;
  roles: ProjectRoleName[];
};
export type UpdateProjectMemberRoleResponse = ProjectMemberData;

export type RemoveProjectMemberPayload = { projectId: number; userId: number };

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

  getRoles(token: string): Promise<IRes<GetProjectRolesResponse>>;

  getMembers(
    query: GetProjectMembersQuery,
    token: string,
  ): Promise<IRes<GetProjectMembersResponse>>;

  addMember(
    payload: AddProjectMemberPayload,
    token: string,
  ): Promise<IRes<AddProjectMemberResponse>>;

  updateMemberRole(
    payload: UpdateProjectMemberRolePayload,
    token: string,
  ): Promise<IRes<UpdateProjectMemberRoleResponse>>;

  removeMember(
    payload: RemoveProjectMemberPayload,
    token: string,
  ): Promise<IRes<void>>;
}
