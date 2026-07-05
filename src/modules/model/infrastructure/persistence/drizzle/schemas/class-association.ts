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
import { models } from "./model";

export const classAssociations = pgTable(
  "class_associations",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    modelId: uuid("model_id")
      .references(() => models.id, { onDelete: "cascade" })
      .notNull(),
    type: varchar("type", { length: 30 }).notNull(),
    sourceClassId: uuid("source_class_id")
      .references(() => elements.id, { onDelete: "cascade" })
      .notNull(),
    targetClassId: uuid("target_class_id")
      .references(() => elements.id, { onDelete: "cascade" })
      .notNull(),
    sourceMultiplicityLower: integer("source_multiplicity_lower")
      .default(1)
      .notNull(),
    sourceMultiplicityUpper: integer("source_multiplicity_upper"),
    targetMultiplicityLower: integer("target_multiplicity_lower")
      .default(1)
      .notNull(),
    targetMultiplicityUpper: integer("target_multiplicity_upper"),
    sourceRole: varchar("source_role", { length: 255 }),
    targetRole: varchar("target_role", { length: 255 }),
    name: varchar("name", { length: 255 }),
    description: text("description"),
    isNavigable: varchar("is_navigable", { length: 5 })
      .default("true")
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_class_associations_model").on(table.modelId),
    index("idx_class_associations_source").on(table.sourceClassId),
    index("idx_class_associations_target").on(table.targetClassId),
  ],
);
