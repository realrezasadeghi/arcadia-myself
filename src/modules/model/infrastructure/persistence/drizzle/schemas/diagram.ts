import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { models } from "./model";

export const diagrams = sqliteTable("diagrams", {
  id: text("id").primaryKey(),
  modelId: text("model_id")
    .notNull()
    .references(() => models.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  name: text("name").notNull(),
  description: text("description").default(""),
  viewportJson: text("viewport_json")
    .notNull()
    .default('{"x":0,"y":0,"zoom":1}'),
  elementLayoutsJson: text("element_layouts_json").notNull().default("[]"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
