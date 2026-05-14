import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  sub: string;
  iat: number;
  exp: number;
};

export function extractUserIdFromJwt(token: string): number {
  try {
    const payload = jwtDecode<TokenPayload>(token);
    if (!payload.sub) throw new Error("Invalid token payload");
    return Number(payload.sub);
  } catch {
    throw new Error("Invalid token");
  }
}
