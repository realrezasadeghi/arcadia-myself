import type {
  CreateLifelinePayload,
  FindLifelineByIdQuery,
  FindLifelinesByScenarioIdQuery,
  ILifelineRepository,
  ReorderLifelinesPayload,
  RemoveLifelinePayload,
  UpdateLifelinePayload,
} from "@/modules/model/application/ports/lifeline";
import { Lifeline } from "@/modules/model/domain/entities/lifeline";
import { eq, asc } from "drizzle-orm";
import { db } from "../client";
import { scenarioLifelines } from "../schemas/lifeline";

type LifelineRow = typeof scenarioLifelines.$inferSelect;

function toEntity(row: LifelineRow): Lifeline {
  return Lifeline.reconstitute({
    id: row.id,
    scenarioId: row.scenarioId,
    name: row.name,
    representedElementType: row.representedElementType,
    representedElementId: row.representedElementId,
    representedElementExternalId: row.representedElementExternalId,
    columnIndex: row.columnIndex,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}

export class DrizzleLifelineRepository implements ILifelineRepository {
  async findById(query: FindLifelineByIdQuery): Promise<Lifeline | null> {
    const row = await db.query.scenarioLifelines.findFirst({
      where: eq(scenarioLifelines.id, query.id),
    });
    return row ? toEntity(row) : null;
  }

  async findByScenarioId(
    query: FindLifelinesByScenarioIdQuery,
  ): Promise<Lifeline[]> {
    const rows = await db
      .select()
      .from(scenarioLifelines)
      .where(eq(scenarioLifelines.scenarioId, query.scenarioId))
      .orderBy(asc(scenarioLifelines.columnIndex));
    return rows.map(toEntity);
  }

  async create(payload: CreateLifelinePayload): Promise<Lifeline> {
    const response = await db
      .insert(scenarioLifelines)
      .values({
        scenarioId: payload.scenarioId,
        name: payload.name,
        representedElementType: payload.representedElementType.value,
        representedElementId: payload.representedElementId ?? null,
        representedElementExternalId:
          payload.representedElementExternalId ?? null,
        columnIndex: payload.columnIndex,
      })
      .returning();

    const [row] = response;
    if (!row) throw new Error("Failed to create lifeline");
    return toEntity(row);
  }

  async update(payload: UpdateLifelinePayload): Promise<Lifeline> {
    const now = new Date();
    const response = await db
      .update(scenarioLifelines)
      .set({
        name: payload.name,
        updatedAt: now,
      })
      .where(eq(scenarioLifelines.id, payload.id))
      .returning();

    const [updated] = response;
    if (!updated) throw new Error(`Lifeline not found with id: ${payload.id}`);
    return toEntity(updated);
  }

  async reorder(payload: ReorderLifelinesPayload): Promise<void> {
    for (let i = 0; i < payload.lifelineIds.length; i++) {
      await db
        .update(scenarioLifelines)
        .set({ columnIndex: i, updatedAt: new Date() })
        .where(eq(scenarioLifelines.id, payload.lifelineIds[i]));
    }
  }

  async remove(payload: RemoveLifelinePayload): Promise<boolean> {
    const result = await db
      .delete(scenarioLifelines)
      .where(eq(scenarioLifelines.id, payload.id));
    return (result?.rowCount ?? 0) > 0;
  }
}
