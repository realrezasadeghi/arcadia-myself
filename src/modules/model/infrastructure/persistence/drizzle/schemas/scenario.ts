import { pgTable, uuid, varchar, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { models } from "./model";

export const scenarioTypeEnum = pgEnum("scenario_type", ["FS", "ES", "IS", "MS"]);

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

export const lifelines = pgTable("lifelines", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  scenarioId: uuid("scenario_id")
    .references(() => scenarios.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  lifelineType: varchar("lifeline_type", { length: 32 }).notNull(),
  elementId: uuid("element_id"),
  ordering: integer("ordering").default(0).notNull(),
  status: varchar("status", { length: 32 }).default("DRAFT").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sequenceMessages = pgTable("sequence_messages", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  scenarioId: uuid("scenario_id")
    .references(() => scenarios.id, { onDelete: "cascade" })
    .notNull(),
  sourceLifelineId: uuid("source_lifeline_id")
    .references(() => lifelines.id, { onDelete: "cascade" })
    .notNull(),
  targetLifelineId: uuid("target_lifeline_id")
    .references(() => lifelines.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  messageType: varchar("message_type", { length: 32 }).notNull(),
  trigger: varchar("trigger", { length: 500 }).default("").notNull(),
  guard: varchar("guard", { length: 500 }).default("").notNull(),
  effect: varchar("effect", { length: 500 }).default("").notNull(),
  label: varchar("label", { length: 500 }).default("").notNull(),
  ordering: integer("ordering").default(0).notNull(),
  status: varchar("status", { length: 32 }).default("DRAFT").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});