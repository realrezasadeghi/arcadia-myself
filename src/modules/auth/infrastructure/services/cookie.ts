import type { ITokenService } from "@/modules/auth/application/ports/token";
import { env } from "@/modules/shared/config/env";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export class CookieTokenService implements ITokenService {
  private readonly cookieName = "token";

  private readonly cookieOptions: Omit<ResponseCookie, "value"> = {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    name: this.cookieName,
    secure: env.isProduction(),
    maxAge: 60 * 60 * 24, // 1 day
  };

  async save(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(this.cookieName, token, this.cookieOptions);
  }

  async get(): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(this.cookieName);
    return token?.value ?? null;
  }

  async delete(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(this.cookieName, "", { ...this.cookieOptions, maxAge: 0 });
  }
}
