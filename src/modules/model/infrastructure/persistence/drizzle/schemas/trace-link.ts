import { pgTable, text } from "drizzle-orm/pg-core";

export const traceLinks = pgTable("trace_links", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull(),
  type: text("type").notNull(),
  sourceElementId: text("source_element_id").notNull(),
  sourceLayer: text("source_layer").notNull(),
  targetElementId: text("target_element_id").notNull(),
  targetLayer: text("target_layer").notNull(),
  description: text("description").notNull().default(""),
  createdAt: text("created_at").notNull(),
});
