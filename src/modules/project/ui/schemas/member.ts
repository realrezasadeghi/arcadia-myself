import { z } from "zod";
import { PROJECT_ROLE_NAMES } from "../../domain/value-objects/project-role";

export const addMemberSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .min(3, "Username must be between 3 and 30 characters")
    .max(30, "Username must be between 3 and 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  roles: z
    .array(z.enum(PROJECT_ROLE_NAMES))
    .min(1, "Please select at least one role"),
});

export type AddMemberFormValues = z.infer<typeof addMemberSchema>;

export const updateMemberRoleSchema = z.object({
  roles: z
    .array(z.enum(PROJECT_ROLE_NAMES))
    .min(1, "Please select at least one role"),
});

export type UpdateMemberRoleFormValues = z.infer<typeof updateMemberRoleSchema>;
