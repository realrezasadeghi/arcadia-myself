import { pgTable, text } from "drizzle-orm/pg-core";
import { elements } from "./element";
import { models } from "./model";

export const relationships = pgTable("relationships", {
  id: text("id").primaryKey(),
  modelId: text("model_id")
    .notNull()
    .references(() => models.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  sourceElementId: text("source_element_id")
    .notNull()
    .references(() => elements.id, { onDelete: "cascade" }),
  targetElementId: text("target_element_id")
    .notNull()
    .references(() => elements.id, { onDelete: "cascade" }),
  name: text("name").notNull().default(""),
  description: text("description").notNull().default(""),
  propertiesJson: text("properties_json").notNull().default("{}"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
