import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { projects } from "@/modules/project/infrastructure/persistence/drizzle/schemas/project";

export const models = sqliteTable("models", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  layer: text("layer").notNull(), // "OA" | "SA" | "LA" | "PA"
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
