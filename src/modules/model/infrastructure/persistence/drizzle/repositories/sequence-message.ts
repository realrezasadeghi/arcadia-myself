import { asc, eq } from "drizzle-orm";
import type {
  CreateMessagePayload,
  FindMessageByIdQuery,
  FindMessagesByScenarioIdQuery,
  IMessageRepository,
  RemoveMessagePayload,
  ReorderMessagesPayload,
  UpdateMessagePayload,
} from "@/modules/model/application/ports/sequence-message";
import { SequenceMessage } from "@/modules/model/domain/entities/sequence-message";
import { db } from "../client";
import { scenarioMessages } from "../schemas/sequence-message";

type MessageRow = typeof scenarioMessages.$inferSelect;

function toEntity(row: MessageRow): SequenceMessage {
  return SequenceMessage.reconstitute({
    id: row.id,
    scenarioId: row.scenarioId,
    name: row.name,
    kind: row.kind,
    sourceLifelineId: row.sourceLifelineId,
    targetLifelineId: row.targetLifelineId,
    executionOrder: row.executionOrder,
    exchangedItemId: row.exchangedItemId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}

export class DrizzleMessageRepository implements IMessageRepository {
  async findById(query: FindMessageByIdQuery): Promise<SequenceMessage | null> {
    const row = await db.query.scenarioMessages.findFirst({
      where: eq(scenarioMessages.id, query.id),
    });
    return row ? toEntity(row) : null;
  }

  async findByScenarioId(
    query: FindMessagesByScenarioIdQuery,
  ): Promise<SequenceMessage[]> {
    const rows = await db
      .select()
      .from(scenarioMessages)
      .where(eq(scenarioMessages.scenarioId, query.scenarioId))
      .orderBy(asc(scenarioMessages.executionOrder));
    return rows.map(toEntity);
  }

  async create(payload: CreateMessagePayload): Promise<SequenceMessage> {
    const response = await db
      .insert(scenarioMessages)
      .values({
        scenarioId: payload.scenarioId,
        name: payload.name,
        kind: payload.kind.value,
        sourceLifelineId: payload.sourceLifelineId,
        targetLifelineId: payload.targetLifelineId,
        executionOrder: payload.executionOrder,
        exchangedItemId: payload.exchangedItemId ?? null,
      })
      .returning();

    const [row] = response;
    if (!row) throw new Error("Failed to create message");
    return toEntity(row);
  }

  async update(payload: UpdateMessagePayload): Promise<SequenceMessage> {
    const now = new Date();
    const updateData: Record<string, unknown> = { updatedAt: now };

    if (payload.name !== undefined) {
      updateData.name = payload.name;
    }
    if (payload.executionOrder !== undefined) {
      updateData.executionOrder = payload.executionOrder;
    }

    const response = await db
      .update(scenarioMessages)
      .set(updateData)
      .where(eq(scenarioMessages.id, payload.id))
      .returning();

    const [updated] = response;
    if (!updated) throw new Error(`Message not found with id: ${payload.id}`);
    return toEntity(updated);
  }

  async reorder(payload: ReorderMessagesPayload): Promise<void> {
    for (const item of payload.messageOrders) {
      await db
        .update(scenarioMessages)
        .set({ executionOrder: item.executionOrder, updatedAt: new Date() })
        .where(eq(scenarioMessages.id, item.id));
    }
  }

  async remove(payload: RemoveMessagePayload): Promise<boolean> {
    const result = await db
      .delete(scenarioMessages)
      .where(eq(scenarioMessages.id, payload.id));
    return (result?.rowCount ?? 0) > 0;
  }
}
