import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "@/modules/shared/config/env";
import {
  diagrams,
  elements,
  models,
  relationships,
  traceLinks,
} from "../schemas";

const client = createClient({
  url: env.get("DATABASE_URL"),
});

export const db = drizzle(client, {
  schema: {
    diagrams,
    elements,
    models,
    relationships,
    traceLinks,
  },
});
