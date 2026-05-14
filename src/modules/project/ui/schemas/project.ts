import { z } from "zod";

export const projectFormSchema = z.object({
  name: z
    .string()
    .min(1, "نام پروژه الزامی است")
    .min(3, "نام پروژه باید حداقل ۳ کاراکتر باشد")
    .max(100, "نام پروژه نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"),
  description: z
    .string()
    .max(500, "توضیحات نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد")
    .optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
