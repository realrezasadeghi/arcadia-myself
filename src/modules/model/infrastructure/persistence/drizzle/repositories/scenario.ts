import type {
  CreateScenarioDiagramPayload,
  CreateScenarioFragmentPayload,
  CreateScenarioLifelinePayload,
  CreateScenarioMessagePayload,
  ScenarioDiagramRepository,
  ScenarioFragmentRepository,
  ScenarioLifelineRepository,
  ScenarioMessageRepository,
} from "@/modules/model/application/ports/scenario";
import { ScenarioDiagram } from "@/modules/model/domain/entities/scenario-diagram";
import { ScenarioFragment } from "@/modules/model/domain/entities/scenario-fragment";
import { ScenarioLifeline } from "@/modules/model/domain/entities/scenario-lifeline";
import { ScenarioMessage } from "@/modules/model/domain/entities/scenario-message";
import { eq } from "drizzle-orm";
import { db } from "../client";
import {
  scenarioDiagrams,
  scenarioFragments,
  scenarioLifelines,
  scenarioMessages,
} from "../schemas";

function toDiagramEntity(
  row: typeof scenarioDiagrams.$inferSelect,
): ScenarioDiagram {
  return ScenarioDiagram.reconstitute({
    id: row.id,
    modelId: row.modelId,
    type: row.type,
    name: row.name,
    description: row.description ?? "",
    viewport: row.viewport,
    layoutConfig: row.layoutConfig,
    lifelines: [],
    messages: [],
    fragments: [],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}

function toLifelineEntity(
  row: typeof scenarioLifelines.$inferSelect,
): ScenarioLifeline {
  return ScenarioLifeline.reconstitute({
    id: row.id,
    diagramId: row.diagramId,
    elementId: row.elementId,
    type: row.type,
    selector: row.selector ?? undefined,
    decomposed: row.decomposed,
    layout: row.layout,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}

function toMessageEntity(
  row: typeof scenarioMessages.$inferSelect,
): ScenarioMessage {
  return ScenarioMessage.reconstitute({
    id: row.id,
    diagramId: row.diagramId,
    sourceLifelineId: row.sourceLifelineId,
    targetLifelineId: row.targetLifelineId,
    sort: row.sort,
    name: row.name,
    signature: row.signature ?? undefined,
    arguments: row.arguments ?? undefined,
    fragmentId: row.fragmentId ?? null,
    layout: row.layout,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}

function toFragmentEntity(
  row: typeof scenarioFragments.$inferSelect,
): ScenarioFragment {
  return ScenarioFragment.reconstitute({
    id: row.id,
    diagramId: row.diagramId,
    type: row.type,
    guard: row.guard ?? undefined,
    parentFragmentId: row.parentFragmentId ?? null,
    childFragmentIds: row.childFragmentIds ?? [],
    messageIds: row.messageIds ?? [],
    layout: row.layout,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}

export class DrizzleScenarioDiagramRepository
  implements ScenarioDiagramRepository
{
  async findById(id: string): Promise<ScenarioDiagram | null> {
    const row = await db.query.scenarioDiagrams.findFirst({
      where: eq(scenarioDiagrams.id, id),
    });
    return row ? toDiagramEntity(row) : null;
  }

  async findByModelId(modelId: string): Promise<ScenarioDiagram[]> {
    const rows = await db
      .select()
      .from(scenarioDiagrams)
      .where(eq(scenarioDiagrams.modelId, modelId));
    return rows.map(toDiagramEntity);
  }

  async create(
    payload: CreateScenarioDiagramPayload,
  ): Promise<ScenarioDiagram> {
    const response = await db
      .insert(scenarioDiagrams)
      .values({
        modelId: payload.modelId,
        type: payload.type,
        name: payload.name,
        description: payload.description ?? "",
        viewport: { x: 0, y: 0, zoom: 1, timeScale: 1 },
        layoutConfig: {
          lifelineSpacing: 200,
          messageHeight: 60,
          fragmentPadding: 20,
          headHeight: 40,
          activationWidth: 12,
        },
      })
      .returning();

    const [row] = response;
    if (!row) throw new Error("Failed to create scenario diagram");

    return toDiagramEntity(row);
  }

  async save(diagram: ScenarioDiagram): Promise<void> {
    const now = new Date();
    await db
      .update(scenarioDiagrams)
      .set({
        name: diagram.name,
        description: diagram.description ?? "",
        viewport: diagram.viewport,
        layoutConfig: diagram.layoutConfig,
        updatedAt: now,
      })
      .where(eq(scenarioDiagrams.id, diagram.id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(scenarioDiagrams).where(eq(scenarioDiagrams.id, id));
  }
}

export class DrizzleScenarioLifelineRepository
  implements ScenarioLifelineRepository
{
  async findById(id: string): Promise<ScenarioLifeline | null> {
    const row = await db.query.scenarioLifelines.findFirst({
      where: eq(scenarioLifelines.id, id),
    });
    return row ? toLifelineEntity(row) : null;
  }

  async findByDiagramId(diagramId: string): Promise<ScenarioLifeline[]> {
    const rows = await db
      .select()
      .from(scenarioLifelines)
      .where(eq(scenarioLifelines.diagramId, diagramId));
    return rows.map(toLifelineEntity);
  }

  async findByElementId(elementId: string): Promise<ScenarioLifeline[]> {
    const rows = await db
      .select()
      .from(scenarioLifelines)
      .where(eq(scenarioLifelines.elementId, elementId));
    return rows.map(toLifelineEntity);
  }

  async create(
    payload: CreateScenarioLifelinePayload,
  ): Promise<ScenarioLifeline> {
    const response = await db
      .insert(scenarioLifelines)
      .values({
        diagramId: payload.diagramId,
        elementId: payload.elementId,
        type: payload.type.value,
        selector: payload.selector ?? null,
        decomposed: payload.decomposed ?? false,
        layout: {
          position: { x: 0, y: 0 },
          size: { width: 120, height: 600 },
          headPosition: 0,
        },
      })
      .returning();

    const [row] = response;
    if (!row) throw new Error("Failed to create scenario lifeline");

    return toLifelineEntity(row);
  }

  async save(lifeline: ScenarioLifeline): Promise<void> {
    const now = new Date();
    await db
      .update(scenarioLifelines)
      .set({
        selector: lifeline.selector ?? null,
        decomposed: lifeline.decomposed,
        layout: lifeline.layout,
        updatedAt: now,
      })
      .where(eq(scenarioLifelines.id, lifeline.id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(scenarioLifelines).where(eq(scenarioLifelines.id, id));
  }
}

export class DrizzleScenarioMessageRepository
  implements ScenarioMessageRepository
{
  async findById(id: string): Promise<ScenarioMessage | null> {
    const row = await db.query.scenarioMessages.findFirst({
      where: eq(scenarioMessages.id, id),
    });
    return row ? toMessageEntity(row) : null;
  }

  async findByDiagramId(diagramId: string): Promise<ScenarioMessage[]> {
    const rows = await db
      .select()
      .from(scenarioMessages)
      .where(eq(scenarioMessages.diagramId, diagramId));
    return rows.map(toMessageEntity);
  }

  async findByLifelineId(lifelineId: string): Promise<ScenarioMessage[]> {
    const rows = await db
      .select()
      .from(scenarioMessages)
      .where(eq(scenarioMessages.sourceLifelineId, lifelineId));
    return rows.map(toMessageEntity);
  }

  async findByFragmentId(fragmentId: string): Promise<ScenarioMessage[]> {
    const rows = await db
      .select()
      .from(scenarioMessages)
      .where(eq(scenarioMessages.fragmentId, fragmentId));
    return rows.map(toMessageEntity);
  }

  async create(
    payload: CreateScenarioMessagePayload,
  ): Promise<ScenarioMessage> {
    const response = await db
      .insert(scenarioMessages)
      .values({
        diagramId: payload.diagramId,
        sourceLifelineId: payload.sourceLifelineId,
        targetLifelineId: payload.targetLifelineId,
        sort: payload.sort.value,
        name: payload.name,
        signature: payload.signature ?? null,
        arguments: payload.arguments ?? null,
        fragmentId: payload.fragmentId ?? null,
        layout: {
          position: { x: 0, y: 0 },
          sequenceOrder: payload.sequenceOrder,
        },
      })
      .returning();

    const [row] = response;
    if (!row) throw new Error("Failed to create scenario message");

    return toMessageEntity(row);
  }

  async save(message: ScenarioMessage): Promise<void> {
    const now = new Date();
    await db
      .update(scenarioMessages)
      .set({
        name: message.name,
        signature: message.signature ?? null,
        arguments: message.arguments ?? null,
        fragmentId: message.fragmentId,
        layout: message.layout,
        updatedAt: now,
      })
      .where(eq(scenarioMessages.id, message.id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(scenarioMessages).where(eq(scenarioMessages.id, id));
  }
}

export class DrizzleScenarioFragmentRepository
  implements ScenarioFragmentRepository
{
  async findById(id: string): Promise<ScenarioFragment | null> {
    const row = await db.query.scenarioFragments.findFirst({
      where: eq(scenarioFragments.id, id),
    });
    return row ? toFragmentEntity(row) : null;
  }

  async findByDiagramId(diagramId: string): Promise<ScenarioFragment[]> {
    const rows = await db
      .select()
      .from(scenarioFragments)
      .where(eq(scenarioFragments.diagramId, diagramId));
    return rows.map(toFragmentEntity);
  }

  async findByParentId(parentFragmentId: string): Promise<ScenarioFragment[]> {
    const rows = await db
      .select()
      .from(scenarioFragments)
      .where(eq(scenarioFragments.parentFragmentId, parentFragmentId));
    return rows.map(toFragmentEntity);
  }

  async create(
    payload: CreateScenarioFragmentPayload,
  ): Promise<ScenarioFragment> {
    const response = await db
      .insert(scenarioFragments)
      .values({
        diagramId: payload.diagramId,
        type: payload.type.value,
        guard: payload.guard ?? null,
        parentFragmentId: payload.parentFragmentId ?? null,
        childFragmentIds: [],
        messageIds: [],
        layout: {
          position: { x: 0, y: 0 },
          size: { width: 400, height: 200 },
          minSequenceOrder: payload.minSequenceOrder,
          maxSequenceOrder: payload.maxSequenceOrder,
        },
      })
      .returning();

    const [row] = response;
    if (!row) throw new Error("Failed to create scenario fragment");

    return toFragmentEntity(row);
  }

  async save(fragment: ScenarioFragment): Promise<void> {
    const now = new Date();
    await db
      .update(scenarioFragments)
      .set({
        guard: fragment.guard ?? null,
        parentFragmentId: fragment.parentFragmentId,
        childFragmentIds: [...fragment.childFragmentIds],
        messageIds: [...fragment.messageIds],
        layout: fragment.layout,
        updatedAt: now,
      })
      .where(eq(scenarioFragments.id, fragment.id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(scenarioFragments).where(eq(scenarioFragments.id, id));
  }
}
