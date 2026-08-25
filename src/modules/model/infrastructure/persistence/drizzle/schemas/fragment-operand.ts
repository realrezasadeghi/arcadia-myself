import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { scenarioFragments } from "./fragment";

export const scenarioFragmentOperands = pgTable("scenario_fragment_operands", {
  id: uuid("id").primaryKey().defaultRandom(),
  fragmentId: uuid("fragment_id")
    .references(() => scenarioFragments.id, { onDelete: "cascade" })
    .notNull(),
  position: integer("position").notNull(),
  guard: text("guard").default("").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
