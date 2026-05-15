import type {
  CreateElementPayload,
  FindElementsByIdQuery,
  FindElementsByModelIdQuery,
  IElementRepository,
  RemoveElementPayload,
  UpdateElementPayload,
} from "@/modules/model/application/ports/element";
import {
  type ElementProperties,
  ModelElement,
} from "@/modules/model/domain/entities/element";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../client";
import { elements } from "../schemas/element";

type ElementRow = typeof elements.$inferSelect;

function toElement(row: ElementRow): ModelElement {
  return ModelElement.reconstitute({
    id: row.id,
    modelId: row.modelId,
    type: row.type,
    name: row.name,
    description: row.description,
    properties: JSON.parse(row.propertiesJson) as ElementProperties,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

export class DrizzleElementRepository implements IElementRepository {
  async findElementsByModelId(
    query: FindElementsByModelIdQuery,
  ): Promise<ModelElement[]> {
    const rows = await db
      .select()
      .from(elements)
      .where(eq(elements.modelId, query.modelId));
    return rows.map(toElement);
  }

  async findElementById(
    query: FindElementsByIdQuery,
  ): Promise<ModelElement | null> {
    const row = await db.query.elements.findFirst({
      where: eq(elements.id, query.id),
    });
    return row ? toElement(row) : null;
  }

  async createElement(payload: CreateElementPayload): Promise<ModelElement> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const defaultProps: ElementProperties = {
      status: "DRAFT",
      ...(payload.properties ?? {}),
    };
    await db.insert(elements).values({
      id,
      modelId: payload.modelId,
      type: payload.type,
      name: payload.name,
      description: payload.description ?? "",
      propertiesJson: JSON.stringify(defaultProps),
      createdAt: now,
      updatedAt: now,
    });
    const row = await db.query.elements.findFirst({
      where: eq(elements.id, id),
    });
    if (!row) throw new Error("Failed to create element");
    return toElement(row);
  }

  async updateElement(payload: UpdateElementPayload): Promise<ModelElement> {
    const existing = await db.query.elements.findFirst({
      where: eq(elements.id, payload.id),
    });
    if (!existing) throw new Error(`Element not found with id : ${payload.id}`);

    const currentProps = JSON.parse(
      existing.propertiesJson,
    ) as ElementProperties;
    const newProps = payload.properties
      ? { ...currentProps, ...payload.properties }
      : currentProps;
    const now = new Date().toISOString();

    await db
      .update(elements)
      .set({
        name: payload.name,
        description: payload.description ?? existing.description,
        propertiesJson: JSON.stringify(newProps),
        updatedAt: now,
      })
      .where(eq(elements.id, payload.id));

    const updated = await db.query.elements.findFirst({
      where: eq(elements.id, payload.id),
    });
    if (!updated) throw new Error(`Element not found with id : ${payload.id}`);
    return toElement(updated);
  }

  async removeElement(payload: RemoveElementPayload): Promise<boolean> {
    const result = await db.delete(elements).where(eq(elements.id, payload.id));
    return (result?.rowsAffected ?? 0) > 0;
  }
}
