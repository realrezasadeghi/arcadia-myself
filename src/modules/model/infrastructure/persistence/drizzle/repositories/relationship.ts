import type {
  CreateRelationshipPayload,
  FindRelationshipsByModelIdQuery,
  IRelationshipRepository,
  RemoveRelationshipPayload,
  UpdateRelationshipPayload,
} from "@/modules/model/application/ports/relationship";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import {
  Relationship,
  type RelationshipProperties,
} from "../../../../domain/entities/relationship";
import { db } from "../client";
import { relationships } from "../schemas/relationship";

type RelRow = typeof relationships.$inferSelect;

function toRelationship(row: RelRow): Relationship {
  return Relationship.reconstitute({
    id: row.id,
    modelId: row.modelId,
    type: row.type,
    sourceElementId: row.sourceElementId,
    targetElementId: row.targetElementId,
    name: row.name,
    description: row.description,
    properties: JSON.parse(row.propertiesJson) as RelationshipProperties,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

export class DrizzleRelationshipRepository implements IRelationshipRepository {
  async findRelationshipsByModelId(
    query: FindRelationshipsByModelIdQuery,
  ): Promise<Relationship[]> {
    const rows = await db
      .select()
      .from(relationships)
      .where(eq(relationships.modelId, query.modelId));
    return rows.map(toRelationship);
  }

  async createRelationship(
    payload: CreateRelationshipPayload,
  ): Promise<Relationship> {
    const id = randomUUID();
    const now = new Date().toISOString();
    await db.insert(relationships).values({
      id,
      modelId: payload.modelId,
      type: payload.type.value, // assuming RelationshipType has .value
      sourceElementId: payload.sourceElementId,
      targetElementId: payload.targetElementId,
      name: payload.name ?? "",
      description: payload.description ?? "",
      propertiesJson: "{}",
      createdAt: now,
      updatedAt: now,
    });
    const row = await db.query.relationships.findFirst({
      where: eq(relationships.id, id),
    });
    if (!row) throw new Error("Failed to create relationship");
    return toRelationship(row);
  }

  async updateRelationship(
    payload: UpdateRelationshipPayload,
  ): Promise<Relationship> {
    const existing = await db.query.relationships.findFirst({
      where: eq(relationships.id, payload.id),
    });
    if (!existing)
      throw new Error(`Relationship not found with id : ${payload.id}`);

    const currentProps = JSON.parse(
      existing.propertiesJson,
    ) as RelationshipProperties;

    const newProps = payload.properties
      ? { ...currentProps, ...payload.properties }
      : currentProps;

    const now = new Date().toISOString();

    await db
      .update(relationships)
      .set({
        name: payload.name ?? existing.name,
        description: payload.description ?? existing.description,
        propertiesJson: JSON.stringify(newProps),
        updatedAt: now,
      })
      .where(eq(relationships.id, payload.id));

    const updated = await db.query.relationships.findFirst({
      where: eq(relationships.id, payload.id),
    });

    if (!updated)
      throw new Error(`Relationship not found with id : ${payload.id}`);

    return toRelationship(updated);
  }

  async removeRelationship(
    payload: RemoveRelationshipPayload,
  ): Promise<boolean> {
    const result = await db
      .delete(relationships)
      .where(eq(relationships.id, payload.id));
    return (result?.rowsAffected ?? 0) > 0;
  }
}
