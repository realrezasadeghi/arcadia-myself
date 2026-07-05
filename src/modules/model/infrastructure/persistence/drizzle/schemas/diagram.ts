import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { models } from "./model";

export const diagrams = pgTable("diagrams", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  modelId: uuid("model_id")
    .references(() => models.id, { onDelete: "cascade" })
    .notNull(),
  type: varchar("type", { length: 10 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").default("").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
