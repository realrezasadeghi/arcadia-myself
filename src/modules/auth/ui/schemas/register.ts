import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "نام الزامی است")
    .min(3, "نام باید حداقل ۳ کاراکتر باشد"),
  username: z
    .string()
    .trim()
    .min(1, "نام کاربری الزامی است")
    .min(3, "نام کاربری باید بین ۳ تا ۳۰ کاراکتر باشد")
    .max(30, "نام کاربری باید بین ۳ تا ۳۰ کاراکتر باشد")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "نام کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد و زیرخط باشد",
    ),
  password: z
    .string()
    .min(1, "رمز عبور الزامی است")
    .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
