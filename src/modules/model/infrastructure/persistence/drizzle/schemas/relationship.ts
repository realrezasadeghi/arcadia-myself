import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { elements } from "./element";
import { models } from "./model";

export const relationships = pgTable("relationships", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  modelId: uuid("model_id")
    .references(() => models.id, { onDelete: "cascade" })
    .notNull(),
  type: varchar("type").notNull(),
  sourceElementId: uuid("source_element_id")
    .references(() => elements.id, { onDelete: "cascade" })
    .notNull(),
  targetElementId: uuid("target_element_id")
    .references(() => elements.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").default("").notNull(),
  properties: jsonb("properties").default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
