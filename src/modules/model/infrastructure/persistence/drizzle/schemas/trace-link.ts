import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { projects } from "@/modules/project/infrastructure/persistence/drizzle/schemas/project";

export const traceLinks = sqliteTable("trace_links", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  sourceElementId: text("source_element_id").notNull(),
  sourceLayer: text("source_layer").notNull(),
  targetElementId: text("target_element_id").notNull(),
  targetLayer: text("target_layer").notNull(),
  description: text("description").notNull().default(""),
  createdAt: text("created_at").notNull(),
});
