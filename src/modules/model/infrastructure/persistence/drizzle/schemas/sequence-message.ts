import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  integer,
} from "drizzle-orm/pg-core";
import { scenarios } from "./scenario";
import { scenarioLifelines } from "./lifeline";

export const scenarioMessages = pgTable("scenario_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  scenarioId: uuid("scenario_id")
    .references(() => scenarios.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  kind: varchar("kind", { length: 20 }).notNull().default("CALL"),
  sourceLifelineId: uuid("source_lifeline_id")
    .references(() => scenarioLifelines.id, { onDelete: "cascade" })
    .notNull(),
  targetLifelineId: uuid("target_lifeline_id")
    .references(() => scenarioLifelines.id, { onDelete: "cascade" })
    .notNull(),
  executionOrder: integer("execution_order").notNull(),
  exchangedItemId: varchar("exchanged_item_id", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
