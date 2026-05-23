import type {
  CreateDiagramPayload,
  FindByIdQuery,
  FindByModelIdQuery,
  IDiagramRepository,
  RemoveDiagramPayload,
  UpdateDiagramLayoutPayload,
  UpdateDiagramPayload,
} from "@/modules/model/application/ports/diagram";
import {
  Diagram,
  type ElementLayout,
  type Viewport,
} from "@/modules/model/domain/entities/diagram";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../client";
import { diagrams } from "../schemas/diagram";

type DiagramRow = typeof diagrams.$inferSelect;

function toEntity(row: DiagramRow): Diagram {
  // Parse JSON strings back to objects
  const viewport: Viewport = row.viewportJson
    ? JSON.parse(row.viewportJson)
    : { x: 0, y: 0, zoom: 1 };

  const elementLayouts: ElementLayout[] = row.elementLayoutsJson
    ? JSON.parse(row.elementLayoutsJson)
    : [];

  return Diagram.reconstitute({
    id: row.id,
    modelId: row.modelId,
    type: row.type,
    name: row.name,
    description: row.description ?? "",
    viewport,
    elementLayouts,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

export class DrizzleDiagramRepository implements IDiagramRepository {
  async findByModelId(query: FindByModelIdQuery): Promise<Diagram[]> {
    const rows = await db
      .select()
      .from(diagrams)
      .where(eq(diagrams.modelId, query.modelId));
    return rows.map(toEntity);
  }

  async findById(query: FindByIdQuery): Promise<Diagram | null> {
    const row = await db.query.diagrams.findFirst({
      where: eq(diagrams.id, query.id),
    });
    return row ? toEntity(row) : null;
  }

  async create(payload: CreateDiagramPayload): Promise<Diagram> {
    const id = randomUUID();
    const now = new Date().toISOString();
    await db.insert(diagrams).values({
      id,
      modelId: payload.modelId,
      type: payload.type.value,
      name: payload.name,
      description: payload.description ?? "",
      viewportJson: JSON.stringify({ x: 0, y: 0, zoom: 1 }),
      elementLayoutsJson: "[]",
      createdAt: now,
      updatedAt: now,
    });
    const row = await db.query.diagrams.findFirst({
      where: eq(diagrams.id, id),
    });
    if (!row) throw new Error("Failed to create diagram");

    return toEntity(row);
  }

  async update(payload: UpdateDiagramPayload): Promise<Diagram> {
    const now = new Date().toISOString();
    await db
      .update(diagrams)
      .set({
        name: payload.name,
        description: payload.description ?? null,
        updatedAt: now,
      })
      .where(eq(diagrams.id, payload.id));
    const row = await db.query.diagrams.findFirst({
      where: eq(diagrams.id, payload.id),
    });
    if (!row) throw new Error(`Diagram not found with id : ${payload.id}`);
    return toEntity(row);
  }

  async updateLayout(payload: UpdateDiagramLayoutPayload): Promise<Diagram> {
    const now = new Date().toISOString();
    const updateData: any = { updatedAt: now };

    if (payload.viewport !== undefined) {
      updateData.viewportJson = JSON.stringify(payload.viewport);
    }

    if (payload.elementLayouts !== undefined) {
      updateData.elementLayoutsJson = JSON.stringify(payload.elementLayouts);
    }

    await db
      .update(diagrams)
      .set(updateData)
      .where(eq(diagrams.id, payload.id));
    const row = await db.query.diagrams.findFirst({
      where: eq(diagrams.id, payload.id),
    });
    if (!row) throw new Error(`Diagram not found with id : ${payload.id}`);
    return toEntity(row);
  }

  async remove(payload: RemoveDiagramPayload): Promise<boolean> {
    const result = await db.delete(diagrams).where(eq(diagrams.id, payload.id));
    return (result?.rowCount ?? 0) > 0;
  }
}
