import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/modules/model/infrastructure/persistence/drizzle/schemas/*.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
