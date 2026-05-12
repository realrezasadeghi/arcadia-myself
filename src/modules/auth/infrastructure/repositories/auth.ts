import type { HttpClient } from "@/modules/shared/utils/http-client";
import type {
  AuthResponse,
  IAuthRepository,
  LoginPayload,
  RegisterPayload,
} from "../../application/ports/auth";

export class AuthRepository implements IAuthRepository {
  constructor(private readonly http: HttpClient) {}

  async login(payload: LoginPayload): Promise<AuthResponse> {
    return this.http
      .post<AuthResponse>("/api/login", JSON.stringify(payload))
      .then((response) => response.data);
  }

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    return this.http
      .post<AuthResponse>("/api/register", JSON.stringify(payload))
      .then((response) => response.data);
  }
}
