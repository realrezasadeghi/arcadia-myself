function getFirstError(errors: unknown): string {
  if (!errors) return "";

  if (Array.isArray(errors)) {
    const first = errors[0];
    return typeof first === "string" ? first : "";
  }

  if (typeof errors === "object" && errors !== null) {
    for (const fieldErrors of Object.values(errors)) {
      if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        const firstMsg = fieldErrors[0];
        if (typeof firstMsg === "string") return firstMsg;
      } else if (typeof fieldErrors === "string") {
        return fieldErrors;
      }
    }
  }

  if (typeof errors === "string") {
    return errors;
  }

  return "";
}

export function resolveErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (typeof error === "object" && error !== null) {
    const maybeHttpError = error as Record<string, unknown>;
    const response = maybeHttpError.response as
      | Record<string, unknown>
      | undefined;
    const responseData = response?.data as Record<string, unknown> | undefined;

    if (responseData?.errors) {
      const firstError = getFirstError(responseData.errors);
      if (firstError) return firstError;
    }

    if (responseData?.message && typeof responseData.message === "string") {
      return responseData.message;
    }

    if (typeof maybeHttpError.message === "string" && maybeHttpError.message) {
      return maybeHttpError.message;
    }

    if (response?.statusText && typeof response.statusText === "string") {
      return response.statusText;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}
