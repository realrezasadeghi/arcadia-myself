import { and, eq, inArray } from "drizzle-orm";
import type {
  CreateLayoutPayload,
  FindLayoutByDiagramIdQuery,
  FindLayoutsByDiagramIdsQuery,
  FindLayoutsContainingElementQuery,
  IDiagramLayoutRepository,
  RemoveLayoutPayload,
  UpdateLayoutPayload,
} from "@/modules/model/application/ports/diagram-layout";
import type {
  ElementLayout,
  Viewport,
} from "@/modules/model/domain/value-objects/diagram-layout";
import { db } from "../client";
import { diagramLayouts } from "../schemas/diagram-layout";

type DiagramLayoutRow = typeof diagramLayouts.$inferSelect;

function parseLayout(row: DiagramLayoutRow): {
  diagramId: string;
  viewport: Viewport;
  elementLayouts: ElementLayout[];
} {
  const viewport: Viewport = row.viewport
    ? (row.viewport as Viewport)
    : { x: 0, y: 0, zoom: 1 };

  const elementLayouts: ElementLayout[] = row.elementPositions
    ? (row.elementPositions as ElementLayout[])
    : [];

  return {
    diagramId: row.diagramId,
    viewport,
    elementLayouts,
  };
}

export class DrizzleDiagramLayoutRepository
  implements IDiagramLayoutRepository
{
  async findByDiagramId(query: FindLayoutByDiagramIdQuery): Promise<{
    diagramId: string;
    viewport: Viewport;
    elementLayouts: ElementLayout[];
  } | null> {
    const row = await db.query.diagramLayouts.findFirst({
      where: eq(diagramLayouts.diagramId, query.diagramId),
    });
    return row ? parseLayout(row) : null;
  }

  async findByDiagramIds(
    query: FindLayoutsByDiagramIdsQuery,
  ): Promise<
    Map<string, { viewport: Viewport; elementLayouts: ElementLayout[] }>
  > {
    if (query.diagramIds.length === 0) return new Map();

    const rows = await db
      .select()
      .from(diagramLayouts)
      .where(inArray(diagramLayouts.diagramId, query.diagramIds));

    const map = new Map<
      string,
      { viewport: Viewport; elementLayouts: ElementLayout[] }
    >();
    for (const row of rows) {
      const parsed = parseLayout(row);
      map.set(parsed.diagramId, {
        viewport: parsed.viewport,
        elementLayouts: parsed.elementLayouts,
      });
    }
    return map;
  }

  async findDiagramIdsContainingElement(
    query: FindLayoutsContainingElementQuery,
  ): Promise<string[]> {
    const rows = await db
      .select({
        diagramId: diagramLayouts.diagramId,
        elementPositions: diagramLayouts.elementPositions,
      })
      .from(diagramLayouts);

    const result: string[] = [];
    for (const row of rows) {
      const positions = (row.elementPositions as ElementLayout[]) ?? [];
      if (positions.some((p) => p.elementId === query.elementId)) {
        result.push(row.diagramId);
      }
    }
    return result;
  }

  async create(payload: CreateLayoutPayload): Promise<void> {
    await db.insert(diagramLayouts).values({
      diagramId: payload.diagramId,
      viewport: { x: 0, y: 0, zoom: 1 },
      elementPositions: [],
    });
  }

  async update(payload: UpdateLayoutPayload): Promise<void> {
    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    if (payload.viewport !== undefined) {
      updateData.viewport = payload.viewport;
    }

    if (payload.elementPositions !== undefined) {
      updateData.elementPositions = payload.elementPositions;
    }

    await db
      .update(diagramLayouts)
      .set(updateData)
      .where(eq(diagramLayouts.diagramId, payload.diagramId));
  }

  async remove(payload: RemoveLayoutPayload): Promise<void> {
    await db
      .delete(diagramLayouts)
      .where(eq(diagramLayouts.diagramId, payload.diagramId));
  }
}
