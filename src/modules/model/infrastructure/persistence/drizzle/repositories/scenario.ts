import type {
  CreateScenarioPayload,
  FindScenarioByIdQuery,
  FindScenariosByModelIdQuery,
  IScenarioRepository,
  RemoveScenarioPayload,
  UpdateScenarioPayload,
} from "@/modules/model/application/ports/scenario";
import { Scenario } from "@/modules/model/domain/entities/scenario";
import { eq } from "drizzle-orm";
import { db } from "../client";
import { scenarios } from "../schemas/scenario";

type ScenarioRow = typeof scenarios.$inferSelect;

function toEntity(row: ScenarioRow): Scenario {
  return Scenario.reconstitute({
    id: row.id,
    modelId: row.modelId,
    name: row.name,
    description: row.description ?? "",
    scenarioType: row.scenarioType,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}

export class DrizzleScenarioRepository implements IScenarioRepository {
  async findById(query: FindScenarioByIdQuery): Promise<Scenario | null> {
    const row = await db.query.scenarios.findFirst({
      where: eq(scenarios.id, query.id),
    });
    return row ? toEntity(row) : null;
  }

  async findByModelId(query: FindScenariosByModelIdQuery): Promise<Scenario[]> {
    const rows = await db
      .select()
      .from(scenarios)
      .where(eq(scenarios.modelId, query.modelId));
    return rows.map(toEntity);
  }

  async create(payload: CreateScenarioPayload): Promise<Scenario> {
    const response = await db
      .insert(scenarios)
      .values({
        modelId: payload.modelId,
        name: payload.name,
        description: payload.description ?? "",
        scenarioType: payload.scenarioType.value,
      })
      .returning();

    const [row] = response;
    if (!row) throw new Error("Failed to create scenario");
    return toEntity(row);
  }

  async update(payload: UpdateScenarioPayload): Promise<Scenario> {
    const now = new Date();
    const response = await db
      .update(scenarios)
      .set({
        name: payload.name,
        description: payload.description ?? "",
        updatedAt: now,
      })
      .where(eq(scenarios.id, payload.id))
      .returning();

    const [updated] = response;
    if (!updated) throw new Error(`Scenario not found with id: ${payload.id}`);
    return toEntity(updated);
  }

  async remove(payload: RemoveScenarioPayload): Promise<boolean> {
    const result = await db
      .delete(scenarios)
      .where(eq(scenarios.id, payload.id));
    return (result?.rowCount ?? 0) > 0;
  }
}
