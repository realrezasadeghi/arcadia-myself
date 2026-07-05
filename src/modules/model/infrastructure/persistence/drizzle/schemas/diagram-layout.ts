import { index, jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { diagrams } from "./diagram";

export const diagramLayouts = pgTable(
  "diagram_layouts",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    diagramId: uuid("diagram_id")
      .references(() => diagrams.id, { onDelete: "cascade" })
      .notNull(),
    viewport: jsonb("viewport").default({ x: 0, y: 0, zoom: 1 }).notNull(),
    elementPositions: jsonb("element_positions").default([]).notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("idx_diagram_layouts_diagram").on(table.diagramId)],
);
