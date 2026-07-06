import { env } from "@/modules/shared/config/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  diagrams,
  elements,
  models,
  relationships,
  traceLinks,
  scenarioDiagrams,
  scenarioLifelines,
  scenarioMessages,
  scenarioFragments,
} from "../schemas";

const pool = new Pool({
  connectionString: env.get("DATABASE_URL"),
});

export const db = drizzle(pool, {
  schema: {
    diagrams,
    elements,
    models,
    relationships,
    traceLinks,
    scenarioDiagrams,
    scenarioLifelines,
    scenarioMessages,
    scenarioFragments,
  },
});
