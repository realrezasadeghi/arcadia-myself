import { cookies } from "next/headers";
import { env } from "@/modules/shared/config/env";
import type { ITokenService } from "../../application/ports/token";

export class TokenService implements ITokenService {
  async save(token: string): Promise<boolean> {
    const store = await cookies();

    store.set("token", token, {
      sameSite: true,
      maxAge: 24 * 3600,
      expires: 24 * 3600,
      httpOnly: env.isProduction(),
    });

    return true;
  }

  async get(): Promise<string | undefined> {
    const store = await cookies();
    return store.get("token")?.value;
  }

  async delete(): Promise<boolean> {
    const store = await cookies();

    store.delete("token");

    return true;
  }
}
