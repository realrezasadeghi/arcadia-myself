import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { users } from "@/modules/auth/infrastructure/persistence/drizzle/schemas/user";

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
