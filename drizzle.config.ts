import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: [
    "./src/modules/model/infrastructure/persistence/drizzle/schemas/model.ts",
    "./src/modules/model/infrastructure/persistence/drizzle/schemas/element.ts",
    "./src/modules/model/infrastructure/persistence/drizzle/schemas/relationship.ts",
    "./src/modules/model/infrastructure/persistence/drizzle/schemas/diagram.ts",
    "./src/modules/model/infrastructure/persistence/drizzle/schemas/trace-link.ts",
  ],
  out: "./drizzle/migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "file:./data/app.db",
  },
});
