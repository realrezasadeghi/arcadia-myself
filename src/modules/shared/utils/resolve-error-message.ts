import type { HttpCustomError } from "./http-client";

export function resolveErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const httpError = error as HttpCustomError;

    httpError.response?.data.eee;

    return (
      httpError.response?.data?.message ||
      httpError?.message ||
      httpError.response?.statusText ||
      fallbackMessage
    );
  }

  return fallbackMessage;
}
