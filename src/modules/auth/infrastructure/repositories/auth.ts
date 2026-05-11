import type { HttpClient } from "@/modules/shared/utils/http-client";
import type {
  IAuthRepository,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "../../application/ports/auth";

export class AuthRepository implements IAuthRepository {
  constructor(private readonly http: HttpClient) {}

  async login(payload: LoginPayload): Promise<LoginResponse> {
    return this.http
      .post<LoginResponse>("/api/login", JSON.stringify(payload))
      .then((response) => response.data);
  }

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    return this.http
      .post<RegisterResponse>("/api/register", JSON.stringify(payload))
      .then((response) => response.data);
  }
}
