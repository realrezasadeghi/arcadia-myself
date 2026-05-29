import type {
  FindByIdQuery,
  FindByModelIdQuery,
} from "@/modules/model/application/ports/diagram";
import type {
  CreateTraceLinkPayload,
  FindByElementIdQuery,
  FindByProjectIdQuery,
  ITraceLinkRepository,
  RemoveTraceLinkPayload,
  UpdateTraceLinkPayload,
} from "@/modules/model/application/ports/trace-link";
import { TraceLink } from "@/modules/model/domain/entities/trace-link";
import { eq, or } from "drizzle-orm";
import { db } from "../client";
import { traceLinks } from "../schemas/trace-link";

type TraceLinkRow = typeof traceLinks.$inferSelect;

function toEntity(row: TraceLinkRow): TraceLink {
  return TraceLink.reconstitute({
    id: row.id,
    projectId: row.projectId,
    sourceModelId: row.sourceModelId,
    targetModelId: row.targetModelId,
    type: row.type,
    sourceElementId: row.sourceElementId,
    sourceLayer: row.sourceLayer,
    targetElementId: row.targetElementId,
    targetLayer: row.targetLayer,
    description: row.description,
    createdAt: row.createdAt?.toISOString() as string,
    updatedAt: row.createdAt?.toISOString() as string, // immutable, use createdAt as updatedAt
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

  async findByModelId(query: FindByModelIdQuery): Promise<TraceLink[]> {
    const rows = await db
      .select()
      .from(traceLinks)
      .where(
        or(
          eq(traceLinks.sourceElementId, query.modelId),
          eq(traceLinks.targetElementId, query.modelId),
        ),
      );
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
    const response = await db
      .insert(traceLinks)
      .values({
        projectId: payload.projectId,
        sourceModelId: payload.sourceModelId,
        targetModelId: payload.targetModelId,
        type: payload.type.value, // TraceLinkType -> string
        sourceElementId: payload.sourceElementId,
        sourceLayer: payload.sourceLayer.value, // Layer -> string
        targetElementId: payload.targetElementId,
        targetLayer: payload.targetLayer.value, // Layer -> string
        description: payload.description ?? "",
      })
      .returning();
    const [row] = response;
    if (!row) throw new Error("Failed to create trace link");
    return toEntity(row);
  }

  async update(payload: UpdateTraceLinkPayload): Promise<TraceLink> {
    const updateData: Partial<typeof traceLinks.$inferInsert> = {};
    if (payload.description !== undefined) {
      updateData.description = payload.description;
    }
    // No updatedAt column in schema? If present, add: updateData.updatedAt = new Date().toISOString();
    const response = await db
      .update(traceLinks)
      .set(updateData)
      .where(eq(traceLinks.id, payload.id))
      .returning();

    const [row] = response;

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
