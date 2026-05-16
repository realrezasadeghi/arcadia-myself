import type {
  CreateModelPayload,
  IModelRepository,
  RemoveModelPayload,
  UpdateModelPayload,
} from "@/modules/model/application/ports/model";
import { Model } from "@/modules/model/domain/entities/model";
import type { Layer } from "@/modules/model/domain/value-objects/layer";
import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";
import { db } from "../client";
import { models } from "../schemas/model";

type ModelRow = typeof models.$inferSelect;

function toModel(row: ModelRow): Model {
  // Assuming Model.reconstitute expects { id, projectId, layer, name, description, createdAt?, updatedAt? }
  return Model.reconstitute({
    id: row.id,
    projectId: row.projectId,
    layer: row.layer, // adjust if Layer is a value object
    name: row.name,
    description: row.description,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

export class DrizzleModelRepository implements IModelRepository {
  async findModelById(id: string): Promise<Model | null> {
    const row = await db.query.models.findFirst({
      where: eq(models.id, id),
    });
    return row ? toModel(row) : null;
  }

  async findModelsByProjectId(projectId: string): Promise<Model[]> {
    const rows = await db
      .select()
      .from(models)
      .where(eq(models.projectId, projectId));
    return rows.map(toModel);
  }

  async findModelByProjectIdAndLayer(
    projectId: string,
    layer: Layer,
  ): Promise<Model | null> {
    const row = await db.query.models.findFirst({
      where: and(
        eq(models.projectId, projectId),
        eq(models.layer, layer.toString()), // adjust if layer is a string value
      ),
    });
    return row ? toModel(row) : null;
  }

  async createModel(payload: CreateModelPayload): Promise<Model> {
    const id = randomUUID();
    const now = new Date().toISOString();
    await db.insert(models).values({
      id,
      projectId: payload.projectId,
      layer: payload.layer.toString(),
      name: payload.name,
      description: payload.description ?? "",
      createdAt: now,
      updatedAt: now,
    });
    const row = await db.query.models.findFirst({
      where: eq(models.id, id),
    });
    if (!row) throw new Error("Failed to create model");
    return toModel(row);
  }

  async updateModel(payload: UpdateModelPayload): Promise<Model> {
    const now = new Date().toISOString();
    await db
      .update(models)
      .set({
        projectId: payload.projectId,
        layer: payload.layer.toString(),
        name: payload.name,
        description: payload.description ?? "",
        updatedAt: now,
      })
      .where(eq(models.id, payload.id));
    const row = await db.query.models.findFirst({
      where: eq(models.id, payload.id),
    });
    if (!row) throw new Error(`Model not found with id : ${payload.id}`);
    return toModel(row);
  }

  async deleteModel(payload: RemoveModelPayload): Promise<boolean> {
    const result = await db.delete(models).where(eq(models.id, payload.id));
    return (result?.rowCount ?? 0) > 0;
  }
}
