import { Entity } from "@/modules/shared/domain/entity";
import { ClassRelationshipType } from "../value-objects/class-relationship-type";
import { Layer } from "../value-objects/layer";
import { ClassStatus } from "../value-objects/class-status";
import { DomainEvent } from "@/modules/shared/domain/event";

export type ClassRelationshipStatus = "DRAFT" | "VALIDATED" | "DEPRECATED";

interface ClassRelationshipProps {
  modelId: string;
  layer: Layer;
  sourceElementId: string;
  targetElementId: string;
  name: string;
  relationshipType: ClassRelationshipType;
  isAggregate: boolean;
  isComposite: boolean;
  sourceMultiplicityLower: number;
  sourceMultiplicityUpper: string;
  targetMultiplicityLower: number;
  targetMultiplicityUpper: string;
  sourceRole: string;
  targetRole: string;
  isNavigableSource: boolean;
  isNavigableTarget: boolean;
  status: ClassRelationshipStatus;
  extensionProperties: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ClassRelationship — relationship between two ClassElements; owned by Model.
 * Capella alignment: ASSOCIATION + isAggregate/isComposite flags instead of
 * separate AGGREGATION/COMPOSITION relationship types.
 */
export class ClassRelationship extends Entity<string> {
  private _name: string;
  private readonly _modelId: string;
  private readonly _layer: Layer;
  private readonly _sourceElementId: string;
  private readonly _targetElementId: string;
  private _relationshipType: ClassRelationshipType;
  private _isAggregate: boolean;
  private _isComposite: boolean;
  private _sourceMultiplicityLower: number;
  private _sourceMultiplicityUpper: string;
  private _targetMultiplicityLower: number;
  private _targetMultiplicityUpper: string;
  private _sourceRole: string;
  private _targetRole: string;
  private _isNavigableSource: boolean;
  private _isNavigableTarget: boolean;
  private _status: ClassRelationshipStatus;
  private _extensionProperties: Record<string, unknown>;
  private _updatedAt: Date;
  readonly createdAt: Date;

  private constructor(id: string, props: ClassRelationshipProps) {
    super(id);
    this._modelId = props.modelId;
    this._layer = props.layer;
    this._sourceElementId = props.sourceElementId;
    this._targetElementId = props.targetElementId;
    this._name = props.name;
    this._relationshipType = props.relationshipType;
    this._isAggregate = props.isAggregate;
    this._isComposite = props.isComposite;
    this._sourceMultiplicityLower = props.sourceMultiplicityLower;
    this._sourceMultiplicityUpper = props.sourceMultiplicityUpper;
    this._targetMultiplicityLower = props.targetMultiplicityLower;
    this._targetMultiplicityUpper = props.targetMultiplicityUpper;
    this._sourceRole = props.sourceRole;
    this._targetRole = props.targetRole;
    this._isNavigableSource = props.isNavigableSource;
    this._isNavigableTarget = props.isNavigableTarget;
    this._status = props.status;
    this._extensionProperties = { ...props.extensionProperties };
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id: string;
    modelId: string;
    layer: Layer | string;
    sourceElementId: string;
    targetElementId: string;
    name?: string;
    relationshipType: string;
    isAggregate?: boolean;
    isComposite?: boolean;
    sourceMultiplicityLower?: number;
    sourceMultiplicityUpper?: string;
    targetMultiplicityLower?: number;
    targetMultiplicityUpper?: string;
    sourceRole?: string;
    targetRole?: string;
    isNavigableSource?: boolean;
    isNavigableTarget?: boolean;
    extensionProperties?: Record<string, unknown>;
  }): ClassRelationship {
    if (!props.sourceElementId) throw new Error("Source element is required");
    if (!props.targetElementId) throw new Error("Target element is required");
    if (props.sourceElementId === props.targetElementId) {
      throw new Error("A relationship cannot connect an element to itself");
    }

    const layer = props.layer instanceof Layer ? props.layer : Layer.from(props.layer);
    const relationshipType = ClassRelationshipType.from(props.relationshipType);

    const isAggregate = props.isAggregate ?? false;
    const isComposite = props.isComposite ?? false;

    if (isComposite && !isAggregate) {
      throw new Error("Composition requires aggregation flag (isAggregate)");
    }

    return new ClassRelationship(props.id, {
      modelId: props.modelId,
      layer,
      sourceElementId: props.sourceElementId,
      targetElementId: props.targetElementId,
      name: props.name ?? "",
      relationshipType,
      isAggregate,
      isComposite,
      sourceMultiplicityLower: props.sourceMultiplicityLower ?? 1,
      sourceMultiplicityUpper: props.sourceMultiplicityUpper ?? "*",
      targetMultiplicityLower: props.targetMultiplicityLower ?? 1,
      targetMultiplicityUpper: props.targetMultiplicityUpper ?? "*",
      sourceRole: props.sourceRole ?? "",
      targetRole: props.targetRole ?? "",
      isNavigableSource: props.isNavigableSource ?? true,
      isNavigableTarget: props.isNavigableTarget ?? true,
      status: "DRAFT",
      extensionProperties: props.extensionProperties ?? {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: {
    id: string;
    modelId: string;
    layer: string;
    sourceElementId: string;
    targetElementId: string;
    name: string;
    relationshipType: string;
    isAggregate: boolean;
    isComposite: boolean;
    sourceMultiplicityLower: number;
    sourceMultiplicityUpper: string;
    targetMultiplicityLower: number;
    targetMultiplicityUpper: string;
    sourceRole: string;
    targetRole: string;
    isNavigableSource: boolean;
    isNavigableTarget: boolean;
    status: ClassRelationshipStatus;
    extensionProperties: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
  }): ClassRelationship {
    return new ClassRelationship(props.id, {
      modelId: props.modelId,
      layer: Layer.from(props.layer),
      sourceElementId: props.sourceElementId,
      targetElementId: props.targetElementId,
      name: props.name,
      relationshipType: ClassRelationshipType.from(props.relationshipType),
      isAggregate: props.isAggregate,
      isComposite: props.isComposite,
      sourceMultiplicityLower: props.sourceMultiplicityLower,
      sourceMultiplicityUpper: props.sourceMultiplicityUpper,
      targetMultiplicityLower: props.targetMultiplicityLower,
      targetMultiplicityUpper: props.targetMultiplicityUpper,
      sourceRole: props.sourceRole,
      targetRole: props.targetRole,
      isNavigableSource: props.isNavigableSource,
      isNavigableTarget: props.isNavigableTarget,
      status: props.status,
      extensionProperties: props.extensionProperties,
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
  get sourceElementId(): string {
    return this._sourceElementId;
  }
  get targetElementId(): string {
    return this._targetElementId;
  }
  get name(): string {
    return this._name;
  }
  get relationshipType(): ClassRelationshipType {
    return this._relationshipType;
  }
  get isAggregate(): boolean {
    return this._isAggregate;
  }
  get isComposite(): boolean {
    return this._isComposite;
  }
  get sourceMultiplicityLower(): number {
    return this._sourceMultiplicityLower;
  }
  get sourceMultiplicityUpper(): string {
    return this._sourceMultiplicityUpper;
  }
  get targetMultiplicityLower(): number {
    return this._targetMultiplicityLower;
  }
  get targetMultiplicityUpper(): string {
    return this._targetMultiplicityUpper;
  }
  get sourceRole(): string {
    return this._sourceRole;
  }
  get targetRole(): string {
    return this._targetRole;
  }
  get isNavigableSource(): boolean {
    return this._isNavigableSource;
  }
  get isNavigableTarget(): boolean {
    return this._isNavigableTarget;
  }
  get status(): ClassRelationshipStatus {
    return this._status;
  }
  get extensionProperties(): Readonly<Record<string, unknown>> {
    return this._extensionProperties;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  rename(name: string): DomainEvent[] {
    this._name = name;
    this._touch();
    return [new ClassRelationshipRenamedEvent(this._id, name)];
  }

  setRelationshipType(relationshipType: ClassRelationshipType): DomainEvent[] {
    this._relationshipType = relationshipType;
    this._touch();
    return [new ClassRelationshipTypeChangedEvent(this._id, relationshipType.value)];
  }

  setAggregateFlags(isAggregate: boolean, isComposite: boolean): DomainEvent[] {
    if (isComposite && !isAggregate) {
      throw new Error("Composition requires aggregation flag (isAggregate)");
    }
    this._isAggregate = isAggregate;
    this._isComposite = isComposite;
    this._touch();
    return [
      new ClassRelationshipAggregateFlagsChangedEvent(
        this._id,
        isAggregate,
        isComposite
      ),
    ];
  }

  setSourceMultiplicity(lower: number, upper: string): DomainEvent[] {
    if (lower < 0) throw new Error("Source multiplicity lower must be >= 0");
    this._sourceMultiplicityLower = lower;
    this._sourceMultiplicityUpper = upper;
    this._touch();
    return [
      new ClassRelationshipSourceMultiplicityChangedEvent(this._id, lower, upper),
    ];
  }

  setTargetMultiplicity(lower: number, upper: string): DomainEvent[] {
    if (lower < 0) throw new Error("Target multiplicity lower must be >= 0");
    this._targetMultiplicityLower = lower;
    this._targetMultiplicityUpper = upper;
    this._touch();
    return [
      new ClassRelationshipTargetMultiplicityChangedEvent(this._id, lower, upper),
    ];
  }

  setSourceRole(role: string): DomainEvent[] {
    this._sourceRole = role;
    this._touch();
    return [new ClassRelationshipSourceRoleChangedEvent(this._id, role)];
  }

  setTargetRole(role: string): DomainEvent[] {
    this._targetRole = role;
    this._touch();
    return [new ClassRelationshipTargetRoleChangedEvent(this._id, role)];
  }

  setNavigability(isNavigableSource: boolean, isNavigableTarget: boolean): DomainEvent[] {
    this._isNavigableSource = isNavigableSource;
    this._isNavigableTarget = isNavigableTarget;
    this._touch();
    return [
      new ClassRelationshipNavigabilityChangedEvent(
        this._id,
        isNavigableSource,
        isNavigableTarget
      ),
    ];
  }

  setExtensionProperty(key: string, value: unknown): DomainEvent[] {
    this._extensionProperties = { ...this._extensionProperties, [key]: value };
    this._touch();
    return [
      new ClassRelationshipExtensionPropertyChangedEvent(this._id, key, value),
    ];
  }

  validate(): DomainEvent[] {
    if (this._status === "DEPRECATED")
      throw new Error("Cannot validate a deprecated relationship");
    this._status = "VALIDATED";
    this._touch();
    return [new ClassRelationshipValidatedEvent(this._id)];
  }

  deprecate(): DomainEvent[] {
    if (this._status === "DEPRECATED") return [];
    this._status = "DEPRECATED";
    this._touch();
    return [new ClassRelationshipDeprecatedEvent(this._id)];
  }

  connects(sourceId: string, targetId: string): boolean {
    return (
      (this._sourceElementId === sourceId && this._targetElementId === targetId) ||
      (this._sourceElementId === targetId && this._targetElementId === sourceId)
    );
  }

  involves(elementId: string): boolean {
    return (
      this._sourceElementId === elementId || this._targetElementId === elementId
    );
  }

  toJSON() {
    return {
      id: this._id,
      modelId: this._modelId,
      layer: this._layer.value,
      sourceElementId: this._sourceElementId,
      targetElementId: this._targetElementId,
      name: this._name,
      relationshipType: this._relationshipType.value,
      isAggregate: this._isAggregate,
      isComposite: this._isComposite,
      sourceMultiplicityLower: this._sourceMultiplicityLower,
      sourceMultiplicityUpper: this._sourceMultiplicityUpper,
      targetMultiplicityLower: this._targetMultiplicityLower,
      targetMultiplicityUpper: this._targetMultiplicityUpper,
      sourceRole: this._sourceRole,
      targetRole: this._targetRole,
      isNavigableSource: this._isNavigableSource,
      isNavigableTarget: this._isNavigableTarget,
      status: this._status,
      extensionProperties: this._extensionProperties,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }
}

/** Domain Events */
export class ClassRelationshipCreatedEvent extends DomainEvent {
  constructor(
    public readonly relationshipId: string,
    public readonly modelId: string,
    public readonly layer: Layer,
    public readonly sourceElementId: string,
    public readonly targetElementId: string,
    public readonly relationshipType: ClassRelationshipType
  ) {
    super("ClassRelationshipCreated");
  }
}

export class ClassRelationshipRenamedEvent extends DomainEvent {
  constructor(public readonly relationshipId: string, public readonly name: string) {
    super("ClassRelationshipRenamed");
  }
}

export class ClassRelationshipTypeChangedEvent extends DomainEvent {
  constructor(
    public readonly relationshipId: string,
    public readonly relationshipType: string
  ) {
    super("ClassRelationshipTypeChanged");
  }
}

export class ClassRelationshipAggregateFlagsChangedEvent extends DomainEvent {
  constructor(
    public readonly relationshipId: string,
    public readonly isAggregate: boolean,
    public readonly isComposite: boolean
  ) {
    super("ClassRelationshipAggregateFlagsChanged");
  }
}

export class ClassRelationshipSourceMultiplicityChangedEvent extends DomainEvent {
  constructor(
    public readonly relationshipId: string,
    public readonly lower: number,
    public readonly upper: string
  ) {
    super("ClassRelationshipSourceMultiplicityChanged");
  }
}

export class ClassRelationshipTargetMultiplicityChangedEvent extends DomainEvent {
  constructor(
    public readonly relationshipId: string,
    public readonly lower: number,
    public readonly upper: string
  ) {
    super("ClassRelationshipTargetMultiplicityChanged");
  }
}

export class ClassRelationshipSourceRoleChangedEvent extends DomainEvent {
  constructor(public readonly relationshipId: string, public readonly role: string) {
    super("ClassRelationshipSourceRoleChanged");
  }
}

export class ClassRelationshipTargetRoleChangedEvent extends DomainEvent {
  constructor(public readonly relationshipId: string, public readonly role: string) {
    super("ClassRelationshipTargetRoleChanged");
  }
}

export class ClassRelationshipNavigabilityChangedEvent extends DomainEvent {
  constructor(
    public readonly relationshipId: string,
    public readonly isNavigableSource: boolean,
    public readonly isNavigableTarget: boolean
  ) {
    super("ClassRelationshipNavigabilityChanged");
  }
}

export class ClassRelationshipExtensionPropertyChangedEvent extends DomainEvent {
  constructor(
    public readonly relationshipId: string,
    public readonly key: string,
    public readonly value: unknown
  ) {
    super("ClassRelationshipExtensionPropertyChanged");
  }
}

export class ClassRelationshipValidatedEvent extends DomainEvent {
  constructor(public readonly relationshipId: string) {
    super("ClassRelationshipValidated");
  }
}

export class ClassRelationshipDeprecatedEvent extends DomainEvent {
  constructor(public readonly relationshipId: string) {
    super("ClassRelationshipDeprecated");
  }
}