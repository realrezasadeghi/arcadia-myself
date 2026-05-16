import { pgTable, text } from "drizzle-orm/pg-core";

export const models = pgTable("models", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull(), // ← just a required field, no FK
  layer: text("layer").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
