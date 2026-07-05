import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { elements } from "./element";

export const classAttributes = pgTable(
  "class_attributes",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    classElementId: uuid("class_element_id")
      .references(() => elements.id, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 }).notNull(),
    visibility: varchar("visibility", { length: 20 })
      .default("public")
      .notNull(),
    isStatic: varchar("is_static", { length: 5 }).default("false").notNull(),
    isReadOnly: varchar("is_read_only", { length: 5 })
      .default("false")
      .notNull(),
    isOptional: varchar("is_optional", { length: 5 })
      .default("false")
      .notNull(),
    defaultValue: text("default_value"),
    description: text("description"),
    multiplicityLower: integer("multiplicity_lower").default(1).notNull(),
    multiplicityUpper: integer("multiplicity_upper"),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("idx_class_attributes_element").on(table.classElementId)],
);
