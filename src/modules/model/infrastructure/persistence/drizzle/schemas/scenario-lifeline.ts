import { pgTable, uuid, varchar, jsonb, boolean, timestamp, text } from "drizzle-orm/pg-core";

export const scenarioLifelines = pgTable("scenario_lifelines", {
  id: uuid("id").primaryKey().defaultRandom(),
  diagramId: uuid("diagram_id").notNull(),
  elementId: uuid("element_id").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  selector: varchar("selector", { length: 255 }),
  decomposed: boolean("decomposed").default(false).notNull(),
  layout: jsonb("layout").$type<{
    position: { x: number; y: number };
    size: { width: number; height: number };
    headPosition: number;
  }>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});