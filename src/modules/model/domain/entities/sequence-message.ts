import { Entity } from "@/modules/shared/domain/entity";
import { MessageType } from "../value-objects/message-type";

interface SequenceMessageProps {
  scenarioId: string;
  name: string;
  kind: MessageType;
  sourceLifelineId: string;
  targetLifelineId: string;
  executionOrder: number;
  exchangedItemId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * SequenceMessage — Entity
 *
 * A message (arrow) between two lifelines in a sequence diagram.
 * Represents an exchange, call, or signal between participants.
 */
export class SequenceMessage extends Entity<string> {
  private _name: string;
  private readonly _scenarioId: string;
  private readonly _kind: MessageType;
  private _sourceLifelineId: string;
  private _targetLifelineId: string;
  private _executionOrder: number;
  private _exchangedItemId: string | null;
  private _updatedAt: Date;
  readonly createdAt: Date;

  private constructor(id: string, props: SequenceMessageProps) {
    super(id);
    this._scenarioId = props.scenarioId;
    this._name = props.name;
    this._kind = props.kind;
    this._sourceLifelineId = props.sourceLifelineId;
    this._targetLifelineId = props.targetLifelineId;
    this._executionOrder = props.executionOrder;
    this._exchangedItemId = props.exchangedItemId;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id: string;
    scenarioId: string;
    name: string;
    kind?: string;
    sourceLifelineId: string;
    targetLifelineId: string;
    executionOrder: number;
    exchangedItemId?: string;
  }): SequenceMessage {
    if (!props.name.trim()) throw new Error("Message name is required");
    // Self-messages are allowed for CALL and RETURN; CREATE/DELETE on self is nonsensical
    if (
      props.sourceLifelineId === props.targetLifelineId &&
      (props.kind === "CREATE" || props.kind === "DELETE")
    )
      throw new Error(
        "Cannot create or destroy the same lifeline with a self-message",
      );

    return new SequenceMessage(props.id, {
      scenarioId: props.scenarioId,
      name: props.name.trim(),
      kind: MessageType.from(props.kind ?? "CALL"),
      sourceLifelineId: props.sourceLifelineId,
      targetLifelineId: props.targetLifelineId,
      executionOrder: props.executionOrder,
      exchangedItemId: props.exchangedItemId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: {
    id: string;
    scenarioId: string;
    name: string;
    kind: string;
    sourceLifelineId: string;
    targetLifelineId: string;
    executionOrder: number;
    exchangedItemId: string | null;
    createdAt: string;
    updatedAt: string;
  }): SequenceMessage {
    return new SequenceMessage(props.id, {
      scenarioId: props.scenarioId,
      name: props.name,
      kind: MessageType.from(props.kind),
      sourceLifelineId: props.sourceLifelineId,
      targetLifelineId: props.targetLifelineId,
      executionOrder: props.executionOrder,
      exchangedItemId: props.exchangedItemId,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  get scenarioId(): string {
    return this._scenarioId;
  }

  get name(): string {
    return this._name;
  }

  get kind(): MessageType {
    return this._kind;
  }

  get sourceLifelineId(): string {
    return this._sourceLifelineId;
  }

  get targetLifelineId(): string {
    return this._targetLifelineId;
  }

  get executionOrder(): number {
    return this._executionOrder;
  }

  get exchangedItemId(): string | null {
    return this._exchangedItemId;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  rename(name: string): void {
    if (!name.trim()) throw new Error("Message name cannot be empty");
    this._name = name.trim();
    this._touch();
  }

  setSource(lifelineId: string): void {
    if (
      lifelineId === this._targetLifelineId &&
      (this._kind.value === "CREATE" || this._kind.value === "DELETE")
    )
      throw new Error("Cannot create or destroy the same lifeline");
    this._sourceLifelineId = lifelineId;
    this._touch();
  }

  setTarget(lifelineId: string): void {
    if (
      lifelineId === this._sourceLifelineId &&
      (this._kind.value === "CREATE" || this._kind.value === "DELETE")
    )
      throw new Error("Cannot create or destroy the same lifeline");
    this._targetLifelineId = lifelineId;
    this._touch();
  }

  setExecutionOrder(order: number): void {
    if (order < 0) throw new Error("Execution order must be non-negative");
    this._executionOrder = order;
    this._touch();
  }

  setExchangedItem(itemId: string | null): void {
    this._exchangedItemId = itemId;
    this._touch();
  }

  toJSON() {
    return {
      id: this._id,
      scenarioId: this._scenarioId,
      name: this._name,
      kind: this._kind.value,
      sourceLifelineId: this._sourceLifelineId,
      targetLifelineId: this._targetLifelineId,
      executionOrder: this._executionOrder,
      exchangedItemId: this._exchangedItemId,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }
}
