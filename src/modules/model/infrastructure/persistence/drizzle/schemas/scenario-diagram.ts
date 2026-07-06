import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const scenarioDiagrams = pgTable("scenario_diagrams", {
  id: uuid("id").primaryKey().defaultRandom(),
  modelId: uuid("model_id").notNull(),
  type: varchar("type", { length: 10 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  viewport: jsonb("viewport")
    .$type<{ x: number; y: number; zoom: number; timeScale: number }>()
    .notNull(),
  layoutConfig: jsonb("layout_config")
    .$type<{
      lifelineSpacing: number;
      messageHeight: number;
      fragmentPadding: number;
      headHeight: number;
      activationWidth: number;
    }>()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
