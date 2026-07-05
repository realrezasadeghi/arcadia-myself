import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { elements } from "./element";

export const classOperations = pgTable(
  "class_operations",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    classElementId: uuid("class_element_id")
      .references(() => elements.id, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    returnType: varchar("return_type", { length: 255 })
      .default("void")
      .notNull(),
    visibility: varchar("visibility", { length: 20 })
      .default("public")
      .notNull(),
    isStatic: varchar("is_static", { length: 5 }).default("false").notNull(),
    isAbstract: varchar("is_abstract", { length: 5 })
      .default("false")
      .notNull(),
    parameters: jsonb("parameters").default([]).notNull(),
    description: text("description"),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("idx_class_operations_element").on(table.classElementId)],
);
