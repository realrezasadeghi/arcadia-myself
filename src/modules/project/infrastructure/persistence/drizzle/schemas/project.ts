import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),

  name: text("name").notNull(),

  description: text("description").notNull().default(""),

  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),

  createdAt: text("created_at").notNull(),

  updatedAt: text("updated_at").notNull(),
});
