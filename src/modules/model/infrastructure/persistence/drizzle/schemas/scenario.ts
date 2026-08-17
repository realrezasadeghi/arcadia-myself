import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { models } from "./model";

export const scenarioTypeEnum = pgEnum("scenario_type", [
  "OIS",
  "SS",
  "LS",
  "PS",
]);

export const scenarios = pgTable("scenarios", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  modelId: uuid("model_id")
    .references(() => models.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").default("").notNull(),
  scenarioType: scenarioTypeEnum("scenario_type").notNull(),
  status: varchar("status", { length: 32 }).default("DRAFT").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
