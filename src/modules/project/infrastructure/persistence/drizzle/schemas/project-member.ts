import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { projects } from "./project";

export const projectMembers = sqliteTable(
  "project_members",
  {
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(),
    role: text("role", { enum: ["OWNER", "EDITOR", "VIEWER"] }).notNull(),
    joinedAt: text("joined_at").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.projectId, t.userId] }),
  }),
);
