import { Entity } from "@/modules/shared/domain/entity";
import { FragmentType } from "../value-objects/fragment-type";

export interface FragmentLayout {
  position: { x: number; y: number };
  size: { width: number; height: number };
  minSequenceOrder: number;
  maxSequenceOrder: number;
}

interface ScenarioFragmentProps {
  diagramId: string;
  type: FragmentType;
  guard?: string;
  parentFragmentId: string | null;
  childFragmentIds: string[];
  messageIds: string[];
  layout: FragmentLayout;
  createdAt: Date;
  updatedAt: Date;
}

export class ScenarioFragment extends Entity<string> {
  private readonly _diagramId: string;
  private readonly _type: FragmentType;
  private _guard?: string;
  private _parentFragmentId: string | null;
  private _childFragmentIds: string[];
  private _messageIds: string[];
  private _layout: FragmentLayout;
  private _updatedAt: Date;
  readonly createdAt: Date;

  private constructor(id: string, props: ScenarioFragmentProps) {
    super(id);
    this._diagramId = props.diagramId;
    this._type = props.type;
    this._guard = props.guard;
    this._parentFragmentId = props.parentFragmentId;
    this._childFragmentIds = [...props.childFragmentIds];
    this._messageIds = [...props.messageIds];
    this._layout = props.layout;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id: string;
    diagramId: string;
    type: string;
    guard?: string;
    parentFragmentId?: string | null;
    minSequenceOrder: number;
    maxSequenceOrder: number;
  }): ScenarioFragment {
    const type = FragmentType.from(props.type);
    const now = new Date();

    return new ScenarioFragment(props.id, {
      diagramId: props.diagramId,
      type,
      guard: props.guard?.trim(),
      parentFragmentId: props.parentFragmentId ?? null,
      childFragmentIds: [],
      messageIds: [],
      layout: {
        position: { x: 0, y: 0 },
        size: { width: 400, height: 200 },
        minSequenceOrder: props.minSequenceOrder,
        maxSequenceOrder: props.maxSequenceOrder,
      },
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: {
    id: string;
    diagramId: string;
    type: string;
    guard: string | undefined;
    parentFragmentId: string | null;
    childFragmentIds: string[];
    messageIds: string[];
    layout: FragmentLayout;
    createdAt: string;
    updatedAt: string;
  }): ScenarioFragment {
    return new ScenarioFragment(props.id, {
      diagramId: props.diagramId,
      type: FragmentType.from(props.type),
      guard: props.guard,
      parentFragmentId: props.parentFragmentId,
      childFragmentIds: [...props.childFragmentIds],
      messageIds: [...props.messageIds],
      layout: props.layout,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  get diagramId(): string {
    return this._diagramId;
  }

  get type(): FragmentType {
    return this._type;
  }

  get guard(): string | undefined {
    return this._guard;
  }

  get parentFragmentId(): string | null {
    return this._parentFragmentId;
  }

  get childFragmentIds(): ReadonlyArray<string> {
    return this._childFragmentIds;
  }

  get messageIds(): ReadonlyArray<string> {
    return this._messageIds;
  }

  get layout(): Readonly<FragmentLayout> {
    return this._layout;
  }

  get minSequenceOrder(): number {
    return this._layout.minSequenceOrder;
  }

  get maxSequenceOrder(): number {
    return this._layout.maxSequenceOrder;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  isRoot(): boolean {
    return this._parentFragmentId === null;
  }

  hasChildren(): boolean {
    return this._childFragmentIds.length > 0;
  }

  hasMessages(): boolean {
    return this._messageIds.length > 0;
  }

  updateGuard(guard: string): void {
    if (!this._type.guardRequired && guard.trim()) {
      throw new Error(`Fragment type "${this._type.value}" does not require a guard`);
    }
    if (this._type.guardRequired && !guard.trim()) {
      throw new Error(`Fragment type "${this._type.value}" requires a guard`);
    }
    this._guard = guard.trim();
    this._touch();
  }

  addChildFragment(fragmentId: string): void {
    if (this._childFragmentIds.includes(fragmentId)) return;
    this._childFragmentIds.push(fragmentId);
    this._touch();
  }

  removeChildFragment(fragmentId: string): void {
    this._childFragmentIds = this._childFragmentIds.filter((id) => id !== fragmentId);
    this._touch();
  }

  addMessage(messageId: string): void {
    if (this._messageIds.includes(messageId)) return;
    this._messageIds.push(messageId);
    this._touch();
  }

  removeMessage(messageId: string): void {
    this._messageIds = this._messageIds.filter((id) => id !== messageId);
    this._touch();
  }

  setParentFragment(parentId: string | null): void {
    this._parentFragmentId = parentId;
    this._touch();
  }

  updateLayout(layout: Partial<FragmentLayout>): void {
    this._layout = { ...this._layout, ...layout };
    this._touch();
  }

  recalculateBounds(messageSequenceOrders: Map<string, number>): void {
    let min = Infinity;
    let max = -Infinity;

    for (const msgId of this._messageIds) {
      const seq = messageSequenceOrders.get(msgId);
      if (seq !== undefined) {
        min = Math.min(min, seq);
        max = Math.max(max, seq);
      }
    }

    for (const childId of this._childFragmentIds) {
      // Child bounds would be calculated recursively
      // This is a placeholder - actual implementation would need child fragment refs
    }

    if (min !== Infinity && max !== -Infinity) {
      this._layout = {
        ...this._layout,
        minSequenceOrder: min,
        maxSequenceOrder: max,
      };
      this._touch();
    }
  }

  toJSON() {
    return {
      id: this._id,
      diagramId: this._diagramId,
      type: this._type.value,
      guard: this._guard,
      parentFragmentId: this._parentFragmentId,
      childFragmentIds: this._childFragmentIds,
      messageIds: this._messageIds,
      layout: this._layout,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }
}