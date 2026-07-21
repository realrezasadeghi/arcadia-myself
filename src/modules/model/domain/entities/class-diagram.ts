import { Entity } from "@/modules/shared/domain/entity";
import { DomainEvent } from "@/modules/shared/domain/event";
import { Layer } from "../value-objects/layer";

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

export interface ElementLayout {
  elementId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface RelationshipLayout {
  relationshipId: string;
  labelX: number | null;
  labelY: number | null;
  sourceRoleLabelX: number | null;
  sourceRoleLabelY: number | null;
  targetRoleLabelX: number | null;
  targetRoleLabelY: number | null;
  sourceMultLabelX: number | null;
  sourceMultLabelY: number | null;
  targetMultLabelX: number | null;
  targetMultLabelY: number | null;
  waypoints: Array<{ x: number; y: number }>;
}

export type ClassDiagramStatus = "DRAFT" | "VALIDATED" | "DEPRECATED";

interface ClassDiagramProps {
  modelId: string;
  layer: Layer;
  name: string;
  description: string | undefined;
  viewport: Viewport;
  elementLayouts: Map<string, ElementLayout>;
  relationshipLayouts: Map<string, RelationshipLayout>;
  status: ClassDiagramStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ClassDiagram — Aggregate Root for the Class Diagram bounded context.
 *
 * Per ARCADIA/Capella: a Diagram is a VIEW over the Model's elements.
 * It owns only LAYOUT information (which element appears where).
 * Elements and Relationships are owned by the Model, not the Diagram.
 */
export class ClassDiagram extends Entity<string> {
  private _name: string;
  private _description: string | undefined;
  private readonly _modelId: string;
  private readonly _layer: Layer;
  private _viewport: Viewport;
  private readonly _elementLayouts: Map<string, ElementLayout>;
  private readonly _relationshipLayouts: Map<string, RelationshipLayout>;
  private _status: ClassDiagramStatus;
  private _updatedAt: Date;
  readonly createdAt: Date;

  private constructor(id: string, props: ClassDiagramProps) {
    super(id);
    this._modelId = props.modelId;
    this._layer = props.layer;
    this._name = props.name;
    this._description = props.description;
    this._viewport = { ...props.viewport };
    this._elementLayouts = new Map(props.elementLayouts);
    this._relationshipLayouts = new Map(props.relationshipLayouts);
    this._status = props.status;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id: string;
    modelId: string;
    layer: Layer | string;
    name: string;
    description?: string;
  }): ClassDiagram {
    if (!props.name.trim()) throw new Error("Class diagram name is required");

    const layer =
      props.layer instanceof Layer ? props.layer : Layer.from(props.layer);

    return new ClassDiagram(props.id, {
      modelId: props.modelId,
      layer,
      name: props.name.trim(),
      description: props.description?.trim(),
      viewport: { x: 0, y: 0, zoom: 1 },
      elementLayouts: new Map(),
      relationshipLayouts: new Map(),
      status: "DRAFT",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: {
    id: string;
    modelId: string;
    layer: string;
    name: string;
    description: string | undefined;
    viewport: Viewport;
    elementLayouts: ElementLayout[];
    relationshipLayouts: RelationshipLayout[];
    status: ClassDiagramStatus;
    createdAt: string;
    updatedAt: string;
  }): ClassDiagram {
    const elementLayouts = new Map<string, ElementLayout>();
    for (const l of props.elementLayouts) {
      elementLayouts.set(l.elementId, l);
    }
    const relationshipLayouts = new Map<string, RelationshipLayout>();
    for (const r of props.relationshipLayouts) {
      relationshipLayouts.set(r.relationshipId, r);
    }
    return new ClassDiagram(props.id, {
      modelId: props.modelId,
      layer: Layer.from(props.layer),
      name: props.name,
      description: props.description,
      viewport: props.viewport,
      elementLayouts,
      relationshipLayouts,
      status: props.status,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  get modelId(): string {
    return this._modelId;
  }
  get layer(): Layer {
    return this._layer;
  }
  get name(): string {
    return this._name;
  }
  get description(): string | undefined {
    return this._description;
  }
  get viewport(): Viewport {
    return { ...this._viewport };
  }
  get status(): ClassDiagramStatus {
    return this._status;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  get elementLayouts(): ReadonlyArray<ElementLayout> {
    return Array.from(this._elementLayouts.values());
  }

  get relationshipLayouts(): ReadonlyArray<RelationshipLayout> {
    return Array.from(this._relationshipLayouts.values());
  }

  // Aggregate root methods - mutations return DomainEvents

  rename(name: string): DomainEvent[] {
    if (!name.trim()) throw new Error("Class diagram name can't be empty");
    const oldName = this._name;
    this._name = name.trim();
    this._touch();
    return [new ClassDiagramRenamedEvent(this._id, oldName, this._name)];
  }

  updateDescription(description?: string): DomainEvent[] {
    this._description = description?.trim();
    this._touch();
    return [
      new ClassDiagramDescriptionChangedEvent(this._id, this._description),
    ];
  }

  updateViewport(viewport: Viewport): DomainEvent[] {
    this._viewport = { ...viewport };
    this._touch();
    return [new ClassDiagramViewportChangedEvent(this._id, viewport)];
  }

  placeElement(
    elementId: string,
    position: { x: number; y: number },
    size?: { width: number; height: number },
  ): DomainEvent[] {
    this._elementLayouts.set(elementId, {
      elementId,
      position,
      size: size ?? { width: 160, height: 80 },
    });
    this._touch();
    return [
      new ClassDiagramElementPlacedEvent(this._id, elementId, position, size),
    ];
  }

  moveElement(
    elementId: string,
    position: { x: number; y: number },
  ): DomainEvent[] {
    const existing = this._elementLayouts.get(elementId);
    if (!existing)
      throw new Error(`Element ${elementId} not placed in this diagram`);
    this._elementLayouts.set(elementId, { ...existing, position });
    this._touch();
    return [new ClassDiagramElementMovedEvent(this._id, elementId, position)];
  }

  removeElementLayout(elementId: string): DomainEvent[] {
    this._elementLayouts.delete(elementId);
    this._touch();
    return [new ClassDiagramElementLayoutRemovedEvent(this._id, elementId)];
  }

  getElementLayout(elementId: string): ElementLayout | null {
    return this._elementLayouts.get(elementId) ?? null;
  }

  hasElement(elementId: string): boolean {
    return this._elementLayouts.has(elementId);
  }

  // Relationship Layout methods

  placeRelationship(
    relationshipId: string,
    layout: {
      labelX?: number | null;
      labelY?: number | null;
      sourceRoleLabelX?: number | null;
      sourceRoleLabelY?: number | null;
      targetRoleLabelX?: number | null;
      targetRoleLabelY?: number | null;
      sourceMultLabelX?: number | null;
      sourceMultLabelY?: number | null;
      targetMultLabelX?: number | null;
      targetMultLabelY?: number | null;
      waypoints?: Array<{ x: number; y: number }>;
    } = {}
  ): DomainEvent[] {
    this._relationshipLayouts.set(relationshipId, {
      relationshipId,
      labelX: layout.labelX ?? null,
      labelY: layout.labelY ?? null,
      sourceRoleLabelX: layout.sourceRoleLabelX ?? null,
      sourceRoleLabelY: layout.sourceRoleLabelY ?? null,
      targetRoleLabelX: layout.targetRoleLabelX ?? null,
      targetRoleLabelY: layout.targetRoleLabelY ?? null,
      sourceMultLabelX: layout.sourceMultLabelX ?? null,
      sourceMultLabelY: layout.sourceMultLabelY ?? null,
      targetMultLabelX: layout.targetMultLabelX ?? null,
      targetMultLabelY: layout.targetMultLabelY ?? null,
      waypoints: layout.waypoints ?? [],
    });
    this._touch();
    return [
      new ClassDiagramRelationshipPlacedEvent(this._id, relationshipId, layout),
    ];
  }

  updateRelationshipLayout(
    relationshipId: string,
    layout: {
      labelX?: number | null;
      labelY?: number | null;
      sourceRoleLabelX?: number | null;
      sourceRoleLabelY?: number | null;
      targetRoleLabelX?: number | null;
      targetRoleLabelY?: number | null;
      sourceMultLabelX?: number | null;
      sourceMultLabelY?: number | null;
      targetMultLabelX?: number | null;
      targetMultLabelY?: number | null;
      waypoints?: Array<{ x: number; y: number }>;
    }
  ): DomainEvent[] {
    const existing = this._relationshipLayouts.get(relationshipId);
    if (!existing)
      throw new Error(`Relationship ${relationshipId} not placed in this diagram`);
    
    this._relationshipLayouts.set(relationshipId, {
      ...existing,
      ...layout,
    });
    this._touch();
    return [new ClassDiagramRelationshipLayoutUpdatedEvent(this._id, relationshipId, layout)];
  }

  removeRelationshipLayout(relationshipId: string): DomainEvent[] {
    this._relationshipLayouts.delete(relationshipId);
    this._touch();
    return [new ClassDiagramRelationshipLayoutRemovedEvent(this._id, relationshipId)];
  }

  getRelationshipLayout(relationshipId: string): RelationshipLayout | null {
    return this._relationshipLayouts.get(relationshipId) ?? null;
  }

  hasRelationship(relationshipId: string): boolean {
    return this._relationshipLayouts.has(relationshipId);
  }

  validate(): DomainEvent[] {
    if (this._status === "DEPRECATED")
      throw new Error("Cannot validate a deprecated class diagram");
    this._status = "VALIDATED";
    this._touch();
    return [new ClassDiagramValidatedEvent(this._id)];
  }

  deprecate(): DomainEvent[] {
    if (this._status === "DEPRECATED") return [];
    this._status = "DEPRECATED";
    this._touch();
    return [new ClassDiagramDeprecatedEvent(this._id)];
  }

  toJSON() {
    return {
      id: this._id,
      modelId: this._modelId,
      layer: this._layer.value,
      name: this._name,
      description: this._description,
      viewport: this._viewport,
      elementLayouts: Array.from(this._elementLayouts.values()),
      relationshipLayouts: Array.from(this._relationshipLayouts.values()),
      status: this._status,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }
}

/** Domain Events */
export class ClassDiagramCreatedEvent extends DomainEvent {
  constructor(
    public readonly diagramId: string,
    public readonly modelId: string,
    public readonly layer: Layer,
    public readonly name: string,
  ) {
    super("ClassDiagramCreated");
  }
}

export class ClassDiagramRenamedEvent extends DomainEvent {
  constructor(
    public readonly diagramId: string,
    public readonly oldName: string,
    public readonly newName: string,
  ) {
    super("ClassDiagramRenamed");
  }
}

export class ClassDiagramDescriptionChangedEvent extends DomainEvent {
  constructor(
    public readonly diagramId: string,
    public readonly description: string | undefined,
  ) {
    super("ClassDiagramDescriptionChanged");
  }
}

export class ClassDiagramViewportChangedEvent extends DomainEvent {
  constructor(
    public readonly diagramId: string,
    public readonly viewport: Viewport,
  ) {
    super("ClassDiagramViewportChanged");
  }
}

export class ClassDiagramElementPlacedEvent extends DomainEvent {
  constructor(
    public readonly diagramId: string,
    public readonly elementId: string,
    public readonly position: { x: number; y: number },
    public readonly size: { width: number; height: number } | undefined,
  ) {
    super("ClassDiagramElementPlaced");
  }
}

export class ClassDiagramElementMovedEvent extends DomainEvent {
  constructor(
    public readonly diagramId: string,
    public readonly elementId: string,
    public readonly position: { x: number; y: number },
  ) {
    super("ClassDiagramElementMoved");
  }
}

export class ClassDiagramElementLayoutRemovedEvent extends DomainEvent {
  constructor(
    public readonly diagramId: string,
    public readonly elementId: string,
  ) {
    super("ClassDiagramElementLayoutRemoved");
  }
}

export class ClassDiagramRelationshipPlacedEvent extends DomainEvent {
  constructor(
    public readonly diagramId: string,
    public readonly relationshipId: string,
    public readonly layout: {
      labelX?: number | null;
      labelY?: number | null;
      sourceRoleLabelX?: number | null;
      sourceRoleLabelY?: number | null;
      targetRoleLabelX?: number | null;
      targetRoleLabelY?: number | null;
      sourceMultLabelX?: number | null;
      sourceMultLabelY?: number | null;
      targetMultLabelX?: number | null;
      targetMultLabelY?: number | null;
      waypoints?: Array<{ x: number; y: number }>;
    },
  ) {
    super("ClassDiagramRelationshipPlaced");
  }
}

export class ClassDiagramRelationshipLayoutUpdatedEvent extends DomainEvent {
  constructor(
    public readonly diagramId: string,
    public readonly relationshipId: string,
    public readonly layout: {
      labelX?: number | null;
      labelY?: number | null;
      sourceRoleLabelX?: number | null;
      sourceRoleLabelY?: number | null;
      targetRoleLabelX?: number | null;
      targetRoleLabelY?: number | null;
      sourceMultLabelX?: number | null;
      sourceMultLabelY?: number | null;
      targetMultLabelX?: number | null;
      targetMultLabelY?: number | null;
      waypoints?: Array<{ x: number; y: number }>;
    },
  ) {
    super("ClassDiagramRelationshipLayoutUpdated");
  }
}

export class ClassDiagramRelationshipLayoutRemovedEvent extends DomainEvent {
  constructor(
    public readonly diagramId: string,
    public readonly relationshipId: string,
  ) {
    super("ClassDiagramRelationshipLayoutRemoved");
  }
}

export class ClassDiagramValidatedEvent extends DomainEvent {
  constructor(public readonly diagramId: string) {
    super("ClassDiagramValidated");
  }
}

export class ClassDiagramDeprecatedEvent extends DomainEvent {
  constructor(public readonly diagramId: string) {
    super("ClassDiagramDeprecated");
  }
}
