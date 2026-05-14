import { env } from "@/modules/shared/config/env";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import type { IStorageService } from "../../application/ports/storage";

export class CookieStorageService implements IStorageService {
  private readonly defaultOptions: Omit<ResponseCookie, "name" | "value"> = {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: env.isProduction(),
    maxAge: 60 * 60 * 24, // 1 day
  };

  async save(
    key: string,
    value: string,
    options?: Partial<Omit<ResponseCookie, "name" | "value">>,
  ): Promise<void> {
    const cookieStore = await cookies();
    const merged = { ...this.defaultOptions, ...options };
    cookieStore.set(key, value, merged);
  }

  async get(key: string): Promise<string | null> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(key);
    return cookie?.value ?? null;
  }

  async delete(key: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(key);
  }
}
