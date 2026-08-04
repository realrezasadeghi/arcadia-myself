import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { models } from "./model";

export const permissionEnum = pgEnum("permission", ["view", "edit"]);

export const sharedLinks = pgTable("shared_links", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  projectId: uuid("project_id").notNull(),
  modelId: uuid("model_id")
    .references(() => models.id, { onDelete: "cascade" })
    .notNull(),
  createdByUserId: uuid("created_by_user_id").notNull(),
  token: varchar("token", { length: 255 }).unique().notNull(),
  permission: permissionEnum("permission").default("view").notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
