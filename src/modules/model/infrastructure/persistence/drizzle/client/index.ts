import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@/modules/shared/config/env";
import {
  classDiagrams,
  classElementLayouts,
  classElements,
  classEnumerationLiterals,
  classOperationParameters,
  classOperations,
  classProperties,
  classRelationshipLayouts,
  classRelationships,
  diagrams,
  elements,
  models,
  relationships,
  scenarioFragmentOperands,
  scenarioFragments,
  scenarioLifelines,
  scenarioMessages,
  scenarios,
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
    scenarioFragmentOperands,
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
