import type { FindByIdQuery } from "@/modules/model/application/ports/diagram";
import type {
  CreateTraceLinkPayload,
  FindByElementIdQuery,
  FindByProjectIdQuery,
  ITraceLinkRepository,
  RemoveTraceLinkPayload,
  UpdateTraceLinkPayload,
} from "@/modules/model/application/ports/trace-link";
import { TraceLink } from "@/modules/model/domain/entities/trace-link";
import { randomUUID } from "crypto";
import { eq, or } from "drizzle-orm";
import { db } from "../client";
import { traceLinks } from "../schemas/trace-link";

type TraceLinkRow = typeof traceLinks.$inferSelect;

function toEntity(row: TraceLinkRow): TraceLink {
  return TraceLink.reconstitute({
    id: row.id,
    projectId: row.projectId,
    type: row.type,
    sourceElementId: row.sourceElementId,
    sourceLayer: row.sourceLayer,
    targetElementId: row.targetElementId,
    targetLayer: row.targetLayer,
    description: row.description,
    createdAt: row.createdAt,
    updatedAt: row.createdAt, // immutable, use createdAt as updatedAt
  });
}

export class DrizzleTraceLinkRepository implements ITraceLinkRepository {
  async findByProjectId(query: FindByProjectIdQuery): Promise<TraceLink[]> {
    const rows = await db
      .select()
      .from(traceLinks)
      .where(eq(traceLinks.projectId, query.projectId));
    return rows.map(toEntity);
  }

  async findByElementId(query: FindByElementIdQuery): Promise<TraceLink[]> {
    const rows = await db
      .select()
      .from(traceLinks)
      .where(
        or(
          eq(traceLinks.sourceElementId, query.elementId),
          eq(traceLinks.targetElementId, query.elementId),
        ),
      );
    return rows.map(toEntity);
  }

  async findById(query: FindByIdQuery): Promise<TraceLink | null> {
    const row = await db.query.traceLinks.findFirst({
      where: eq(traceLinks.id, query.id),
    });
    return row ? toEntity(row) : null;
  }

  async create(payload: CreateTraceLinkPayload): Promise<TraceLink> {
    const id = randomUUID();
    const now = new Date().toISOString();
    await db.insert(traceLinks).values({
      id,
      projectId: payload.projectId,
      type: payload.type.value, // TraceLinkType -> string
      sourceElementId: payload.sourceElementId,
      sourceLayer: payload.sourceLayer.value, // Layer -> string
      targetElementId: payload.targetElementId,
      targetLayer: payload.targetLayer.value, // Layer -> string
      description: payload.description ?? "",
      createdAt: now,
    });
    const row = await db.query.traceLinks.findFirst({
      where: eq(traceLinks.id, id),
    });
    if (!row) throw new Error("Failed to create trace link");
    return toEntity(row);
  }

  async update(payload: UpdateTraceLinkPayload): Promise<TraceLink> {
    const updateData: Partial<typeof traceLinks.$inferInsert> = {};
    if (payload.description !== undefined) {
      updateData.description = payload.description;
    }
    // No updatedAt column in schema? If present, add: updateData.updatedAt = new Date().toISOString();
    await db
      .update(traceLinks)
      .set(updateData)
      .where(eq(traceLinks.id, payload.id));
    const row = await db.query.traceLinks.findFirst({
      where: eq(traceLinks.id, payload.id),
    });
    if (!row) throw new Error(`Trace link not found with id : ${payload.id}`);
    return toEntity(row);
  }

  async remove(payload: RemoveTraceLinkPayload): Promise<boolean> {
    const result = await db
      .delete(traceLinks)
      .where(eq(traceLinks.id, payload.id));
    return (result?.rowCount ?? 0) > 0;
  }
}
