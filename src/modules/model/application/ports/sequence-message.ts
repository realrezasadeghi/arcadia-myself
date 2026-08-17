import type { SequenceMessage } from "../../domain/entities/sequence-message";
import type { MessageType } from "../../domain/value-objects/message-type";

export type FindMessageByIdQuery = {
  id: string;
};

export type FindMessagesByScenarioIdQuery = {
  scenarioId: string;
};

export type CreateMessagePayload = {
  scenarioId: string;
  name: string;
  kind: MessageType;
  sourceLifelineId: string;
  targetLifelineId: string;
  executionOrder: number;
  exchangedItemId?: string;
};

export type UpdateMessagePayload = {
  id: string;
  name: string;
};

export type ReorderMessagesPayload = {
  scenarioId: string;
  messageOrders: Array<{ id: string; executionOrder: number }>;
};

export type RemoveMessagePayload = {
  id: string;
};

export interface IMessageRepository {
  findById(query: FindMessageByIdQuery): Promise<SequenceMessage | null>;
  findByScenarioId(
    query: FindMessagesByScenarioIdQuery,
  ): Promise<SequenceMessage[]>;
  create(payload: CreateMessagePayload): Promise<SequenceMessage>;
  update(payload: UpdateMessagePayload): Promise<SequenceMessage>;
  reorder(payload: ReorderMessagesPayload): Promise<void>;
  remove(payload: RemoveMessagePayload): Promise<boolean>;
}
