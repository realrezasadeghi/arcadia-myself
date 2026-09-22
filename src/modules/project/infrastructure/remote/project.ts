import { env } from "@/modules/shared/config/env";
import { HttpClient } from "@/modules/shared/utils/http-client";
import type { IRes } from "@/modules/shared/utils/response";
import type {
  AddProjectMemberPayload,
  AddProjectMemberResponse,
  CreateProjectPayload,
  CreateProjectsResponse,
  GetAllProjectsResponse,
  GetProjectByIdQuery,
  GetProjectByIdResponse,
  GetProjectMembersQuery,
  GetProjectMembersResponse,
  GetProjectRolesResponse,
  IProjectRepository,
  RemoveProjectMemberPayload,
  RemoveProjectPayload,
  UpdateProjectMemberRolePayload,
  UpdateProjectMemberRoleResponse,
  UpdateProjectPayload,
  UpdateProjectsResponse,
} from "../../application/ports/project";

export class ProjectRemoteRepository implements IProjectRepository {
  private readonly http: HttpClient;

  constructor() {
    this.http = new HttpClient({
      baseURL: env.get("API_BASE_URL"),
    });
  }

  private headers(token: string) {
    return { Authorization: `Bearer ${token}` };
  }

  async getProjectById(
    query: GetProjectByIdQuery,
    token: string,
  ): Promise<IRes<GetProjectByIdResponse>> {
    return this.http
      .get<IRes<GetProjectByIdResponse>>(`/api/projects/${query.id}`, {
        headers: this.headers(token),
      })
      .then((res) => res.data);
  }

  async getAllProjects(token: string): Promise<IRes<GetAllProjectsResponse>> {
    return this.http
      .get<IRes<GetAllProjectsResponse>>("/api/projects", {
        headers: this.headers(token),
      })
      .then((res) => res.data);
  }

  async create(
    payload: CreateProjectPayload,
    token: string,
  ): Promise<IRes<CreateProjectsResponse>> {
    return this.http
      .post("/api/projects", JSON.stringify(payload), {
        headers: this.headers(token),
      })
      .then((res) => res.data);
  }

  async update(
    payload: UpdateProjectPayload,
    token: string,
  ): Promise<IRes<UpdateProjectsResponse>> {
    return this.http
      .put(
        `/api/projects/${payload.id}`,
        JSON.stringify({
          name: payload.name,
          description: payload.description,
        }),
        { headers: this.headers(token) },
      )
      .then((res) => res.data);
  }

  async remove(
    payload: RemoveProjectPayload,
    token: string,
  ): Promise<IRes<void>> {
    return this.http
      .delete(`/api/projects/${payload.id}`, { headers: this.headers(token) })
      .then((res) => res.data);
  }

  // ─── RBAC: roles ────────────────────────────────────────────────────────────

  async getRoles(token: string): Promise<IRes<GetProjectRolesResponse>> {
    return this.http
      .get<IRes<GetProjectRolesResponse>>("/api/project-roles", {
        headers: this.headers(token),
      })
      .then((res) => res.data);
  }

  // ─── RBAC: members ──────────────────────────────────────────────────────────

  async getMembers(
    query: GetProjectMembersQuery,
    token: string,
  ): Promise<IRes<GetProjectMembersResponse>> {
    return this.http
      .get<IRes<GetProjectMembersResponse>>(
        `/api/projects/${query.projectId}/members`,
        { headers: this.headers(token) },
      )
      .then((res) => res.data);
  }

  async addMember(
    payload: AddProjectMemberPayload,
    token: string,
  ): Promise<IRes<AddProjectMemberResponse>> {
    return this.http
      .post(
        `/api/projects/${payload.projectId}/members`,
        JSON.stringify({ username: payload.username, roles: payload.roles }),
        { headers: this.headers(token) },
      )
      .then((res) => res.data);
  }

  async updateMemberRole(
    payload: UpdateProjectMemberRolePayload,
    token: string,
  ): Promise<IRes<UpdateProjectMemberRoleResponse>> {
    return this.http
      .patch(
        `/api/projects/${payload.projectId}/members/${payload.userId}`,
        JSON.stringify({ roles: payload.roles }),
        { headers: this.headers(token) },
      )
      .then((res) => res.data);
  }

  async removeMember(
    payload: RemoveProjectMemberPayload,
    token: string,
  ): Promise<IRes<void>> {
    return this.http
      .delete(`/api/projects/${payload.projectId}/members/${payload.userId}`, {
        headers: this.headers(token),
      })
      .then((res) => res.data);
  }
}
