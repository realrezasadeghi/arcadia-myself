export interface IRes<T = unknown> {
  success: boolean;
  status: number;
  data: T;
  meta: { message: string };
}

export const ok = <T>(
  data: T,
  message: string = "با موفقیت انجام شد",
): IRes<T> => ({
  success: true,
  status: 200,
  data,
  meta: { message },
});

export const fail = <T = unknown>(
  error: Error | string | unknown,
  status: number = 500,
  data?: T,
): IRes<T> => {
  let message = "خطای ناشناخته";

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  }

  return {
    success: false,
    status,
    data: data as T,
    meta: { message },
  };
};
