import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const scenarioMessages = pgTable("scenario_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  diagramId: uuid("diagram_id").notNull(),
  sourceLifelineId: uuid("source_lifeline_id").notNull(),
  targetLifelineId: uuid("target_lifeline_id").notNull(),
  sort: varchar("sort", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  signature: varchar("signature", { length: 500 }),
  arguments: text("arguments"),
  fragmentId: uuid("fragment_id"),
  layout: jsonb("layout")
    .$type<{
      position: { x: number; y: number };
      sequenceOrder: number;
    }>()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
