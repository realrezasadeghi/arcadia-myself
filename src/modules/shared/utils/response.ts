export interface IRes<T = unknown> {
  data: T;
  message: string;
  success: boolean;
}

export const ok = <T>(
  data: T,
  message: string = "با موفقیت انجام شد",
): IRes<T> => ({
  data,
  message,
  success: true,
});

export const fail = <T = unknown>(
  error: Error | string | unknown,
  data?: T,
): IRes<T> => {
  let message = "خطای ناشناخته";

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  }

  return {
    message,
    success: false,
    data: data as T,
  };
};
