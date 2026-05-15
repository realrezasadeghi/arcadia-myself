import { relations } from "drizzle-orm";

import { projects } from "../schemas/project";
import { projectMembers } from "../schemas/project-member";

export const projectRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, {
    fields: [projects.ownerId],
    references: [users.id],
  }),

  members: many(projectMembers),
}));

export const projectMemberRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),

  user: one(users, {
    fields: [projectMembers.userId],
    references: [users.id],
  }),
}));
