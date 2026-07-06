import { Entity } from "@/modules/shared/domain/entity";
import { MessageSort } from "../value-objects/message-sort";
import { FragmentType } from "../value-objects/fragment-type";

export interface MessageLayout {
  position: { x: number; y: number };
  sequenceOrder: number;
}

interface ScenarioMessageProps {
  diagramId: string;
  sourceLifelineId: string;
  targetLifelineId: string;
  sort: MessageSort;
  name: string;
  signature?: string;
  arguments?: string;
  fragmentId: string | null;
  layout: MessageLayout;
  createdAt: Date;
  updatedAt: Date;
}

export class ScenarioMessage extends Entity<string> {
  private readonly _diagramId: string;
  private readonly _sourceLifelineId: string;
  private readonly _targetLifelineId: string;
  private readonly _sort: MessageSort;
  private _name: string;
  private _signature?: string;
  private _arguments?: string;
  private _fragmentId: string | null;
  private _layout: MessageLayout;
  private _updatedAt: Date;
  readonly createdAt: Date;

  private constructor(id: string, props: ScenarioMessageProps) {
    super(id);
    this._diagramId = props.diagramId;
    this._sourceLifelineId = props.sourceLifelineId;
    this._targetLifelineId = props.targetLifelineId;
    this._sort = props.sort;
    this._name = props.name;
    this._signature = props.signature;
    this._arguments = props.arguments;
    this._fragmentId = props.fragmentId;
    this._layout = props.layout;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id: string;
    diagramId: string;
    sourceLifelineId: string;
    targetLifelineId: string;
    sort: string;
    name: string;
    signature?: string;
    arguments?: string;
    fragmentId?: string | null;
    sequenceOrder: number;
  }): ScenarioMessage {
    const sort = MessageSort.from(props.sort);
    const now = new Date();

    return new ScenarioMessage(props.id, {
      diagramId: props.diagramId,
      sourceLifelineId: props.sourceLifelineId,
      targetLifelineId: props.targetLifelineId,
      sort,
      name: props.name.trim(),
      signature: props.signature?.trim(),
      arguments: props.arguments?.trim(),
      fragmentId: props.fragmentId ?? null,
      layout: {
        position: { x: 0, y: 0 },
        sequenceOrder: props.sequenceOrder,
      },
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: {
    id: string;
    diagramId: string;
    sourceLifelineId: string;
    targetLifelineId: string;
    sort: string;
    name: string;
    signature: string | undefined;
    arguments: string | undefined;
    fragmentId: string | null;
    layout: MessageLayout;
    createdAt: string;
    updatedAt: string;
  }): ScenarioMessage {
    return new ScenarioMessage(props.id, {
      diagramId: props.diagramId,
      sourceLifelineId: props.sourceLifelineId,
      targetLifelineId: props.targetLifelineId,
      sort: MessageSort.from(props.sort),
      name: props.name,
      signature: props.signature,
      arguments: props.arguments,
      fragmentId: props.fragmentId,
      layout: props.layout,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  get diagramId(): string {
    return this._diagramId;
  }

  get sourceLifelineId(): string {
    return this._sourceLifelineId;
  }

  get targetLifelineId(): string {
    return this._targetLifelineId;
  }

  get sort(): MessageSort {
    return this._sort;
  }

  get name(): string {
    return this._name;
  }

  get signature(): string | undefined {
    return this._signature;
  }

  get arguments(): string | undefined {
    return this._arguments;
  }

  get fragmentId(): string | null {
    return this._fragmentId;
  }

  get layout(): Readonly<MessageLayout> {
    return this._layout;
  }

  get sequenceOrder(): number {
    return this._layout.sequenceOrder;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  rename(name: string): void {
    if (!name.trim()) throw new Error("Message name cannot be empty");
    this._name = name.trim();
    this._touch();
  }

  updateSignature(signature?: string): void {
    this._signature = signature?.trim();
    this._touch();
  }

  updateArguments(arguments_: string): void {
    this._arguments = arguments_.trim();
    this._touch();
  }

  moveToFragment(fragmentId: string | null): void {
    this._fragmentId = fragmentId;
    this._touch();
  }

  reorder(newSequenceOrder: number): void {
    this._layout = { ...this._layout, sequenceOrder: newSequenceOrder };
    this._touch();
  }

  updatePosition(position: { x: number; y: number }): void {
    this._layout = { ...this._layout, position };
    this._touch();
  }

  isSelfMessage(): boolean {
    return this._sourceLifelineId === this._targetLifelineId;
  }

  isReply(): boolean {
    return this._sort.isReturn();
  }

  isCreate(): boolean {
    return this._sort.value === "create";
  }

  isDestroy(): boolean {
    return this._sort.value === "destroy";
  }

  toJSON() {
    return {
      id: this._id,
      diagramId: this._diagramId,
      sourceLifelineId: this._sourceLifelineId,
      targetLifelineId: this._targetLifelineId,
      sort: this._sort.value,
      name: this._name,
      signature: this._signature,
      arguments: this._arguments,
      fragmentId: this._fragmentId,
      layout: this._layout,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }
}