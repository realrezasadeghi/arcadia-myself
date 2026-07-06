import { jsonb, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const scenarioFragments = pgTable("scenario_fragments", {
  id: uuid("id").primaryKey().defaultRandom(),
  diagramId: uuid("diagram_id").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  guard: varchar("guard", { length: 500 }),
  parentFragmentId: uuid("parent_fragment_id"),
  childFragmentIds: jsonb("child_fragment_ids").$type<string[]>().default([]).notNull(),
  messageIds: jsonb("message_ids").$type<string[]>().default([]).notNull(),
  layout: jsonb("layout")
    .$type<{
      position: { x: number; y: number };
      size: { width: number; height: number };
      minSequenceOrder: number;
      maxSequenceOrder: number;
    }>()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
