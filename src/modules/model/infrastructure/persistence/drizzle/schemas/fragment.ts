import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { scenarios } from "./scenario";

export const fragmentOperatorEnum = pgEnum("fragment_operator", [
  "alt",
  "opt",
  "loop",
  "break",
  "par",
  "critical",
  "assert",
  "neg",
  "ignore",
  "consider",
  "strict",
  "seq",
]);

export const scenarioFragments = pgTable("scenario_fragments", {
  id: uuid("id").primaryKey().defaultRandom(),
  scenarioId: uuid("scenario_id")
    .references(() => scenarios.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  operator: fragmentOperatorEnum("operator").notNull(),
  guard: text("guard").default("").notNull(),
  rowIndex: integer("row_index").notNull(),
  columnIndex: integer("column_index").notNull(),
  spanColumns: integer("span_columns").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
