import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { models } from "./model";

export const diagrams = pgTable("diagrams", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  modelId: uuid("model_id")
    .references(() => models.id, { onDelete: "cascade" })
    .notNull(),
  type: varchar("type", { length: 10 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").default("").notNull(),
  viewport: jsonb("viewport").default({ x: 0, y: 0, zoom: 1 }).notNull(),
  elementLayouts: jsonb("element_layouts").array().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
