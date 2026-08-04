import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { extractUserIdFromJwt } from "@/modules/shared/libs/extract-jwt";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";

type AuthContext = { token: string };
type AuthContextWithUserId = { token: string; userId: number };

interface WithAuthOptions {
  extractUserId: true;
}

export function withAuth<TPayload, TResult>(
  handler: (
    payload: TPayload,
    context: AuthContextWithUserId,
  ) => Promise<TResult>,
  options: WithAuthOptions,
): (payload: TPayload) => Promise<IRes<TResult>>;

export function withAuth<TPayload, TResult>(
  handler: (payload: TPayload, context: AuthContext) => Promise<TResult>,
): (payload: TPayload) => Promise<IRes<TResult>>;

export function withAuth<TPayload, TResult>(
  handler:
    | ((payload: TPayload, context: AuthContext) => Promise<TResult>)
    | ((payload: TPayload, context: AuthContextWithUserId) => Promise<TResult>),
  options?: WithAuthOptions,
): (payload: TPayload) => Promise<IRes<TResult>> {
  return async (payload: TPayload) => {
    try {
      const token = await cookiesStorageService.get("token");

      if (!token) {
        throw new Error("Token is required");
      }

      if (options?.extractUserId) {
        const userId = extractUserIdFromJwt(token);
        const result = await (
          handler as (
            payload: TPayload,
            context: AuthContextWithUserId,
          ) => Promise<TResult>
        )(payload, { token, userId });
        return ok(result);
      }

      const result = await (
        handler as (payload: TPayload, context: AuthContext) => Promise<TResult>
      )(payload, { token });
      return ok(result);
    } catch (error) {
      return fail(error);
    }
  };
}

export function withAuthNoPayload<TResult>(
  handler: (context: AuthContextWithUserId) => Promise<TResult>,
  options: WithAuthOptions,
): () => Promise<IRes<TResult>>;

export function withAuthNoPayload<TResult>(
  handler: (context: AuthContext) => Promise<TResult>,
): () => Promise<IRes<TResult>>;

export function withAuthNoPayload<TResult>(
  handler:
    | ((context: AuthContext) => Promise<TResult>)
    | ((context: AuthContextWithUserId) => Promise<TResult>),
  options?: WithAuthOptions,
): () => Promise<IRes<TResult>> {
  return async () => {
    try {
      const token = await cookiesStorageService.get("token");

      if (!token) {
        throw new Error("Token is required");
      }

      if (options?.extractUserId) {
        const userId = extractUserIdFromJwt(token);
        const result = await (
          handler as (context: AuthContextWithUserId) => Promise<TResult>
        )({
          token,
          userId,
        });
        return ok(result);
      }

      const result = await (
        handler as (context: AuthContext) => Promise<TResult>
      )({ token });
      return ok(result);
    } catch (error) {
      return fail(error);
    }
  };
}
