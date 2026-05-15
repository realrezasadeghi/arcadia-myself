import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { models } from "./model";

export const elements = sqliteTable("model_elements", {
  id: text("id").primaryKey(),
  modelId: text("model_id")
    .notNull()
    .references(() => models.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  propertiesJson: text("properties_json")
    .notNull()
    .default('{"status":"DRAFT"}'),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
