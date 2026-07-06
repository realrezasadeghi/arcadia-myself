import { Entity } from "@/modules/shared/domain/entity";
import { DiagramType } from "../value-objects/diagram-type";
import type { ScenarioFragment } from "./scenario-fragment";
import type { ScenarioLifeline } from "./scenario-lifeline";
import type { ScenarioMessage } from "./scenario-message";

export interface ScenarioViewport {
  x: number;
  y: number;
  zoom: number;
  timeScale: number;
}

export interface ScenarioLayoutConfig {
  lifelineSpacing: number;
  messageHeight: number;
  fragmentPadding: number;
  headHeight: number;
  activationWidth: number;
}

const DEFAULT_LAYOUT_CONFIG: ScenarioLayoutConfig = {
  lifelineSpacing: 200,
  messageHeight: 60,
  fragmentPadding: 20,
  headHeight: 40,
  activationWidth: 12,
};

interface ScenarioDiagramProps {
  modelId: string;
  type: DiagramType;
  name: string;
  description?: string;
  viewport: ScenarioViewport;
  layoutConfig: ScenarioLayoutConfig;
  lifelines: Map<string, ScenarioLifeline>;
  messages: Map<string, ScenarioMessage>;
  fragments: Map<string, ScenarioFragment>;
  createdAt: Date;
  updatedAt: Date;
}

export class ScenarioDiagram extends Entity<string> {
  private readonly _modelId: string;
  private readonly _type: DiagramType;
  private _name: string;
  private _description?: string;
  private _viewport: ScenarioViewport;
  private _layoutConfig: ScenarioLayoutConfig;
  private readonly _lifelines: Map<string, ScenarioLifeline>;
  private readonly _messages: Map<string, ScenarioMessage>;
  private readonly _fragments: Map<string, ScenarioFragment>;
  private _updatedAt: Date;
  readonly createdAt: Date;

  private constructor(id: string, props: ScenarioDiagramProps) {
    super(id);
    this._modelId = props.modelId;
    this._type = props.type;
    this._name = props.name;
    this._description = props.description;
    this._viewport = props.viewport;
    this._layoutConfig = props.layoutConfig;
    this._lifelines = props.lifelines;
    this._messages = props.messages;
    this._fragments = props.fragments;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id: string;
    modelId: string;
    type: string;
    name: string;
    description?: string;
  }): ScenarioDiagram {
    if (!props.name.trim()) throw new Error("Diagram name is required");

    const diagramType = DiagramType.from(props.type);

    if (!diagramType.isScenario())
      throw new Error(`Diagram type "${props.type}" is not a scenario type`);

    const now = new Date();

    return new ScenarioDiagram(props.id, {
      modelId: props.modelId,
      type: diagramType,
      name: props.name.trim(),
      description: props.description?.trim(),
      viewport: { x: 0, y: 0, zoom: 1, timeScale: 1 },
      layoutConfig: { ...DEFAULT_LAYOUT_CONFIG },
      lifelines: new Map(),
      messages: new Map(),
      fragments: new Map(),
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: {
    id: string;
    modelId: string;
    type: string;
    name: string;
    description: string;
    viewport: ScenarioViewport;
    layoutConfig: ScenarioLayoutConfig;
    lifelines: ScenarioLifeline[];
    messages: ScenarioMessage[];
    fragments: ScenarioFragment[];
    createdAt: string;
    updatedAt: string;
  }): ScenarioDiagram {
    const lifelines = new Map<string, ScenarioLifeline>();
    for (const l of props.lifelines) lifelines.set(l.id, l);

    const messages = new Map<string, ScenarioMessage>();
    for (const m of props.messages) messages.set(m.id, m);

    const fragments = new Map<string, ScenarioFragment>();
    for (const f of props.fragments) fragments.set(f.id, f);

    return new ScenarioDiagram(props.id, {
      modelId: props.modelId,
      type: DiagramType.from(props.type),
      name: props.name,
      description: props.description,
      viewport: props.viewport,
      layoutConfig: props.layoutConfig,
      lifelines,
      messages,
      fragments,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  get modelId(): string {
    return this._modelId;
  }

  get type(): DiagramType {
    return this._type;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | undefined {
    return this._description;
  }

  get viewport(): Readonly<ScenarioViewport> {
    return this._viewport;
  }

  get layoutConfig(): Readonly<ScenarioLayoutConfig> {
    return this._layoutConfig;
  }

  get lifelines(): ReadonlyArray<ScenarioLifeline> {
    return Array.from(this._lifelines.values());
  }

  get messages(): ReadonlyArray<ScenarioMessage> {
    return Array.from(this._messages.values());
  }

  get fragments(): ReadonlyArray<ScenarioFragment> {
    return Array.from(this._fragments.values());
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get lifelineCount(): number {
    return this._lifelines.size;
  }

  get messageCount(): number {
    return this._messages.size;
  }

  get fragmentCount(): number {
    return this._fragments.size;
  }

  rename(name: string): void {
    if (!name.trim()) throw new Error("Diagram name cannot be empty");
    this._name = name.trim();
    this._touch();
  }

  updateDescription(description?: string): void {
    this._description = description?.trim();
    this._touch();
  }

  updateViewport(viewport: Partial<ScenarioViewport>): void {
    this._viewport = { ...this._viewport, ...viewport };
    this._touch();
  }

  updateLayoutConfig(config: Partial<ScenarioLayoutConfig>): void {
    this._layoutConfig = { ...this._layoutConfig, ...config };
    this._touch();
  }

  addLifeline(lifeline: ScenarioLifeline): void {
    if (this._lifelines.has(lifeline.id))
      throw new Error(`Lifeline ${lifeline.id} already exists`);
    this._lifelines.set(lifeline.id, lifeline);
    this._touch();
  }

  removeLifeline(lifelineId: string): void {
    this._lifelines.delete(lifelineId);
    this._touch();
  }

  getLifeline(lifelineId: string): ScenarioLifeline | undefined {
    return this._lifelines.get(lifelineId);
  }

  hasLifeline(lifelineId: string): boolean {
    return this._lifelines.has(lifelineId);
  }

  addMessage(message: ScenarioMessage): void {
    if (this._messages.has(message.id))
      throw new Error(`Message ${message.id} already exists`);
    this._messages.set(message.id, message);
    this._touch();
  }

  removeMessage(messageId: string): void {
    this._messages.delete(messageId);
    this._touch();
  }

  getMessage(messageId: string): ScenarioMessage | undefined {
    return this._messages.get(messageId);
  }

  hasMessage(messageId: string): boolean {
    return this._messages.has(messageId);
  }

  getMessagesByFragment(fragmentId: string | null): ScenarioMessage[] {
    return Array.from(this._messages.values()).filter(
      (m) => m.fragmentId === fragmentId,
    );
  }

  getMessagesByLifeline(lifelineId: string): ScenarioMessage[] {
    return Array.from(this._messages.values()).filter(
      (m) =>
        m.sourceLifelineId === lifelineId || m.targetLifelineId === lifelineId,
    );
  }

  getOrderedMessages(): ScenarioMessage[] {
    return Array.from(this._messages.values()).sort(
      (a, b) => a.sequenceOrder - b.sequenceOrder,
    );
  }

  reorderMessages(messageIds: string[]): void {
    messageIds.forEach((id, index) => {
      const msg = this._messages.get(id);
      if (msg) msg.reorder(index);
    });
    this._touch();
  }

  addFragment(fragment: ScenarioFragment): void {
    if (this._fragments.has(fragment.id))
      throw new Error(`Fragment ${fragment.id} already exists`);
    this._fragments.set(fragment.id, fragment);
    this._touch();
  }

  removeFragment(fragmentId: string): void {
    this._fragments.delete(fragmentId);
    this._touch();
  }

  getFragment(fragmentId: string): ScenarioFragment | undefined {
    return this._fragments.get(fragmentId);
  }

  hasFragment(fragmentId: string): boolean {
    return this._fragments.has(fragmentId);
  }

  getRootFragments(): ScenarioFragment[] {
    return Array.from(this._fragments.values()).filter((f) => f.isRoot());
  }

  getChildFragments(parentId: string): ScenarioFragment[] {
    return Array.from(this._fragments.values()).filter(
      (f) => f.parentFragmentId === parentId,
    );
  }

  getFragmentTree(): ScenarioFragment[] {
    const roots = this.getRootFragments();
    const result: ScenarioFragment[] = [];

    const traverse = (fragment: ScenarioFragment) => {
      result.push(fragment);
      for (const childId of fragment.childFragmentIds) {
        const child = this.getFragment(childId);
        if (child) traverse(child);
      }
    };

    for (const root of roots) traverse(root);
    return result;
  }

  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this._lifelines.size === 0) {
      errors.push("Scenario must have at least one lifeline");
    }

    for (const msg of this._messages.values()) {
      if (!this._lifelines.has(msg.sourceLifelineId)) {
        errors.push(
          `Message ${msg.id}: source lifeline ${msg.sourceLifelineId} not found`,
        );
      }
      if (!this._lifelines.has(msg.targetLifelineId)) {
        errors.push(
          `Message ${msg.id}: target lifeline ${msg.targetLifelineId} not found`,
        );
      }
    }

    for (const frag of this._fragments.values()) {
      if (frag.type.guardRequired && !frag.guard) {
        errors.push(
          `Fragment ${frag.id} (${frag.type.value}): guard is required`,
        );
      }
      if (
        frag.parentFragmentId &&
        !this._fragments.has(frag.parentFragmentId)
      ) {
        errors.push(
          `Fragment ${frag.id}: parent fragment ${frag.parentFragmentId} not found`,
        );
      }
    }

    const sequenceOrders = new Set<number>();
    for (const msg of this._messages.values()) {
      if (sequenceOrders.has(msg.sequenceOrder)) {
        errors.push(`Duplicate sequence order: ${msg.sequenceOrder}`);
      }
      sequenceOrders.add(msg.sequenceOrder);
    }

    return { valid: errors.length === 0, errors };
  }

  toJSON() {
    return {
      id: this._id,
      modelId: this._modelId,
      type: this._type.value,
      name: this._name,
      description: this._description,
      viewport: this._viewport,
      layoutConfig: this._layoutConfig,
      lifelines: Array.from(this._lifelines.values()).map((l) => l.toJSON()),
      messages: Array.from(this._messages.values()).map((m) => m.toJSON()),
      fragments: Array.from(this._fragments.values()).map((f) => f.toJSON()),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }
}
