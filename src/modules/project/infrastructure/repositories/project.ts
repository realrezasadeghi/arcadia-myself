import { env } from "@/modules/shared/config/env";
import { HttpClient } from "@/modules/shared/utils/http-client";
import type { IRes } from "@/modules/shared/utils/response";
import type {
  CreateProjectPayload,
  CreateProjectsResponse,
  GetAllProjectsResponse,
  GetProjectByIdQuery,
  GetProjectByIdResponse,
  IProjectRepository,
  RemoveProjectPayload,
  UpdateProjectPayload,
  UpdateProjectsResponse,
} from "../../application/ports/project";

export class ProjectRepository implements IProjectRepository {
  private readonly http: HttpClient;

  constructor() {
    this.http = new HttpClient({
      baseURL: env.get("API_BASE_URL"),
    });
  }

  async getProjectById(
    query: GetProjectByIdQuery,
    token: string,
  ): Promise<IRes<GetProjectByIdResponse>> {
    const headers = { Authorization: `Bearer ${token}` };
    return this.http
      .get<IRes<GetProjectByIdResponse>>(`/api/projects/${query.id}`, {
        headers,
      })
      .then((res) => res.data);
  }

  async getAllProjects(token: string): Promise<IRes<GetAllProjectsResponse>> {
    const headers = { Authorization: `Bearer ${token}` };
    return this.http
      .get<IRes<GetAllProjectsResponse>>("/api/projects", { headers })
      .then((res) => {
        return res.data;
      });
  }

  async create(
    payload: CreateProjectPayload,
    token: string,
  ): Promise<IRes<CreateProjectsResponse>> {
    const headers = { Authorization: `Bearer ${token}` };
    return this.http
      .post("/api/projects", JSON.stringify(payload), { headers })
      .then((res) => res.data);
  }

  async update(
    payload: UpdateProjectPayload,
    token: string,
  ): Promise<IRes<UpdateProjectsResponse>> {
    const headers = { Authorization: `Bearer ${token}` };

    return this.http
      .put(
        `/api/projects/${payload.id}`,
        JSON.stringify({
          name: payload.name,
          description: payload.description,
        }),
        { headers },
      )
      .then((res) => res.data);
  }

  async remove(
    payload: RemoveProjectPayload,
    token: string,
  ): Promise<IRes<void>> {
    const headers = { Authorization: `Bearer ${token}` };
    return this.http
      .delete(`/api/projects/${payload.id}`, { headers })
      .then((res) => res.data);
  }
}
