import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const models = pgTable("models", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  projectId: text("project_id").notNull(), // ← just a required field, no FK
  layer: varchar("layer", { length: 10 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").default("").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
