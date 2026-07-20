import { z } from "zod";

export const projectFormSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name cannot exceed 100 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  isSeed: z.boolean().optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
