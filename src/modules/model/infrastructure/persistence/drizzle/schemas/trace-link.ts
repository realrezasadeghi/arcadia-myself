import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { elements } from "./element";
import { models } from "./model";

export const traceLinks = pgTable("trace_links", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  projectId: text("project_id").notNull(),
  sourceModelId: uuid("source_model_id")
    .references(() => models.id, { onDelete: "cascade" })
    .notNull(),
  targetModelId: uuid("target_model_id")
    .references(() => models.id, { onDelete: "cascade" })
    .notNull(),
  type: text("type").notNull(),
  sourceElementId: uuid("source_element_id")
    .references(() => elements.id, { onDelete: "cascade" })
    .notNull(),
  sourceLayer: text("source_layer").notNull(),
  targetElementId: uuid("target_element_id")
    .references(() => elements.id, { onDelete: "cascade" })
    .notNull(),
  targetLayer: text("target_layer").notNull(),
  description: text("description").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
