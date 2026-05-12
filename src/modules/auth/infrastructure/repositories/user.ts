import type { HttpClient } from "@/modules/shared/utils/http-client";
import type {
  GetMePayload,
  GetMeResponse,
  IUserRepository,
} from "../../application/ports/user";

export class UserRepository implements IUserRepository {
  constructor(private readonly http: HttpClient) {}

  async getMe(payload: GetMePayload): Promise<GetMeResponse> {
    const headers = { Authorization: `Bearer ${payload.token}` };
    return this.http
      .get<GetMeResponse>("/api/me", { headers })
      .then((res) => res.data);
  }
}
