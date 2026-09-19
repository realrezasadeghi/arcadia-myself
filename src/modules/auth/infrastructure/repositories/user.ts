import type { HttpClient } from "@/modules/shared/utils/http-client";
import type {
  ChangePasswordPayload,
  ChangePasswordResponse,
  GetMePayload,
  GetMeResponse,
  IUserRepository,
  LogoutPayload,
  UpdateMePayload,
  UpdateMeResponse,
} from "../../application/ports/user";

export class UserRepository implements IUserRepository {
  constructor(private readonly http: HttpClient) {}

  async getMe(payload: GetMePayload): Promise<GetMeResponse> {
    const headers = { Authorization: `Bearer ${payload.token}` };
    return this.http
      .get<GetMeResponse>("/api/me", { headers })
      .then((res) => res.data);
  }

  async updateMe(payload: UpdateMePayload): Promise<UpdateMeResponse> {
    const headers = { Authorization: `Bearer ${payload.token}` };
    return this.http
      .patch<UpdateMeResponse>(
        "/api/me",
        JSON.stringify({ name: payload.name }),
        { headers },
      )
      .then((res) => res.data);
  }

  async changePassword(
    payload: ChangePasswordPayload,
  ): Promise<ChangePasswordResponse> {
    const headers = { Authorization: `Bearer ${payload.token}` };
    return this.http
      .patch<ChangePasswordResponse>(
        "/api/me",
        JSON.stringify({
          current_password: payload.current_password,
          password: payload.password,
          password_confirmation: payload.password_confirmation,
        }),
        { headers },
      )
      .then((res) => res.data);
  }

  async logout(payload: LogoutPayload): Promise<void> {
    const headers = { Authorization: `Bearer ${payload.token}` };
    await this.http.post("/api/logout", undefined, { headers });
  }
}
