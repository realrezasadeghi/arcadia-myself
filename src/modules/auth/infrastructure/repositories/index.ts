import { env } from "@/modules/shared/config/env";
import { HttpClient } from "@/modules/shared/utils/http-client";
import { AuthRepository } from "./auth";

const http = new HttpClient({ baseURL: env.get("API_BASE_URL") });

export const authRepository = new AuthRepository(http);
