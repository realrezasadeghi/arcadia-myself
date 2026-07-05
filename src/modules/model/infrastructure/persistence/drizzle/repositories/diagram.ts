import { eq } from "drizzle-orm";
import type {
  CreateDiagramPayload,
  FindByIdQuery,
  FindByModelIdQuery,
  IDiagramRepository,
  RemoveDiagramPayload,
  UpdateDiagramPayload,
} from "@/modules/model/application/ports/diagram";
import { Diagram } from "@/modules/model/domain/entities/diagram";
import { db } from "../client";
import { diagrams } from "../schemas/diagram";

type DiagramRow = typeof diagrams.$inferSelect;

function toEntity(row: DiagramRow): Diagram {
  return Diagram.reconstitute({
    id: row.id,
    modelId: row.modelId,
    type: row.type,
    name: row.name,
    description: row.description ?? "",
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
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
    const response = await db
      .insert(diagrams)
      .values({
        modelId: payload.modelId,
        type: payload.type.value,
        name: payload.name,
        description: payload.description ?? "",
      })
      .returning();

    const [row] = response;

    if (!row) throw new Error("Failed to create diagram");

    return toEntity(row);
  }

  async update(payload: UpdateDiagramPayload): Promise<Diagram> {
    const now = new Date();
    const response = await db
      .update(diagrams)
      .set({
        name: payload.name,
        description: payload.description ?? "",
        updatedAt: now,
      })
      .where(eq(diagrams.id, payload.id))
      .returning();
    const [updated] = response;
    if (!updated) throw new Error(`Diagram not found with id : ${payload.id}`);
    return toEntity(updated);
  }

  async remove(payload: RemoveDiagramPayload): Promise<boolean> {
    const result = await db.delete(diagrams).where(eq(diagrams.id, payload.id));
    return (result?.rowCount ?? 0) > 0;
  }
}
