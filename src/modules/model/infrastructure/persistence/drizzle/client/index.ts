import { env } from "@/modules/shared/config/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  classDiagrams,
  classElements,
  classProperties,
  classOperations,
  classOperationParameters,
  classEnumerationLiterals,
  classRelationships,
  classElementLayouts,
  classRelationshipLayouts,
  diagrams,
  elements,
  models,
  relationships,
  scenarios,
  scenarioLifelines,
  scenarioMessages,
  scenarioFragments,
  traceLinks,
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
    scenarios,
    scenarioLifelines,
    scenarioMessages,
    scenarioFragments,
    classDiagrams,
    classElements,
    classProperties,
    classOperations,
    classOperationParameters,
    classEnumerationLiterals,
    classRelationships,
    classElementLayouts,
    classRelationshipLayouts,
  },
});
