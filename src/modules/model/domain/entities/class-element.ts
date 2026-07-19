import { Entity } from "@/modules/shared/domain/entity";
import { ClassElementType } from "../value-objects/class-element-type";
import { Layer } from "../value-objects/layer";
import { ClassStatus } from "../value-objects/class-status";
import { DomainEvent } from "@/modules/shared/domain/event";

export type ClassElementStatus = "DRAFT" | "VALIDATED" | "DEPRECATED";

interface ClassElementProps {
  modelId: string;
  layer: Layer;
  name: string;
  elementType: ClassElementType;
  isAbstract: boolean;
  isStatic: boolean;
  parentId: string | null;
  ordering: number;
  status: ClassElementStatus;
  extensionProperties: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ClassElement — represents a Class, Interface, Enum, DataType, or Primitive.
 * Owned by a Model (layer-scoped), NOT by a Diagram.
 * Diagrams reference elements via ClassElementLayout (view positions).
 */
export class ClassElement extends Entity<string> {
  private _name: string;
  private readonly _modelId: string;
  private readonly _layer: Layer;
  private readonly _elementType: ClassElementType;
  private _isAbstract: boolean;
  private _isStatic: boolean;
  private _parentId: string | null;
  private _ordering: number;
  private _status: ClassElementStatus;
  private _extensionProperties: Record<string, unknown>;
  private _updatedAt: Date;
  readonly createdAt: Date;

  private constructor(id: string, props: ClassElementProps) {
    super(id);
    this._modelId = props.modelId;
    this._layer = props.layer;
    this._name = props.name;
    this._elementType = props.elementType;
    this._isAbstract = props.isAbstract;
    this._isStatic = props.isStatic;
    this._parentId = props.parentId;
    this._ordering = props.ordering;
    this._status = props.status;
    this._extensionProperties = { ...props.extensionProperties };
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id: string;
    modelId: string;
    layer: Layer | string;
    name: string;
    elementType: string;
    isAbstract?: boolean;
    isStatic?: boolean;
    parentId?: string | null;
    ordering?: number;
    extensionProperties?: Record<string, unknown>;
  }): ClassElement {
    if (!props.name.trim()) throw new Error("Class element name is required");

    const layer = props.layer instanceof Layer ? props.layer : Layer.from(props.layer);
    const elementType = ClassElementType.from(props.elementType);

    if (!elementType.layer.equals(layer)) {
      throw new Error(
        `Element type "${elementType.label}" does not belong to layer "${layer.label}"`
      );
    }

    // Validate isAbstract only allowed on CLASS
    if (props.isAbstract && !elementType.isClass()) {
      throw new Error("Only CLASS elements can be abstract");
    }

    return new ClassElement(props.id, {
      modelId: props.modelId,
      layer,
      name: props.name.trim(),
      elementType,
      isAbstract: props.isAbstract ?? false,
      isStatic: props.isStatic ?? false,
      parentId: props.parentId ?? null,
      ordering: props.ordering ?? 0,
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
    name: string;
    elementType: string;
    isAbstract: boolean;
    isStatic: boolean;
    parentId: string | null;
    ordering: number;
    status: ClassElementStatus;
    extensionProperties: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
  }): ClassElement {
    return new ClassElement(props.id, {
      modelId: props.modelId,
      layer: Layer.from(props.layer),
      name: props.name,
      elementType: ClassElementType.from(props.elementType),
      isAbstract: props.isAbstract,
      isStatic: props.isStatic,
      parentId: props.parentId,
      ordering: props.ordering,
      status: props.status,
      extensionProperties: props.extensionProperties,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  // Getters
  get modelId(): string {
    return this._modelId;
  }
  get layer(): Layer {
    return this._layer;
  }
  get name(): string {
    return this._name;
  }
  get elementType(): ClassElementType {
    return this._elementType;
  }
  get isAbstract(): boolean {
    return this._isAbstract;
  }
  get isStatic(): boolean {
    return this._isStatic;
  }
  get parentId(): string | null {
    return this._parentId;
  }
  get ordering(): number {
    return this._ordering;
  }
  get status(): ClassElementStatus {
    return this._status;
  }
  get extensionProperties(): Readonly<Record<string, unknown>> {
    return this._extensionProperties;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  isRoot(): boolean {
    return this._parentId === null;
  }

  // Mutations (return DomainEvent for event sourcing)
  rename(name: string): DomainEvent[] {
    if (!name.trim()) throw new Error("Class element name can't be empty");
    const oldName = this._name;
    this._name = name.trim();
    this._touch();
    return [new ClassElementRenamedEvent(this._id, oldName, this._name)];
  }

  setAbstract(isAbstract: boolean): DomainEvent[] {
    if (isAbstract && !this._elementType.isClass()) {
      throw new Error("Only CLASS elements can be abstract");
    }
    const changed = this._isAbstract !== isAbstract;
    this._isAbstract = isAbstract;
    this._touch();
    return changed ? [new ClassElementAbstractChangedEvent(this._id, isAbstract)] : [];
  }

  setStatic(isStatic: boolean): DomainEvent[] {
    const changed = this._isStatic !== isStatic;
    this._isStatic = isStatic;
    this._touch();
    return changed ? [new ClassElementStaticChangedEvent(this._id, isStatic)] : [];
  }

  setParent(parentId: string | null): DomainEvent[] {
    if (parentId === this._id) throw new Error("Element cannot be its own parent");
    const oldParentId = this._parentId;
    this._parentId = parentId;
    this._touch();
    return oldParentId !== parentId
      ? [new ClassElementParentChangedEvent(this._id, oldParentId, parentId)]
      : [];
  }

  setOrdering(ordering: number): DomainEvent[] {
    const changed = this._ordering !== ordering;
    this._ordering = ordering;
    this._touch();
    return changed ? [new ClassElementOrderingChangedEvent(this._id, ordering)] : [];
  }

  setExtensionProperty(key: string, value: unknown): DomainEvent[] {
    this._extensionProperties = { ...this._extensionProperties, [key]: value };
    this._touch();
    return [new ClassElementExtensionPropertyChangedEvent(this._id, key, value)];
  }

  validate(): DomainEvent[] {
    if (this._status === "DEPRECATED")
      throw new Error("Cannot validate a deprecated element");
    this._status = "VALIDATED";
    this._touch();
    return [new ClassElementValidatedEvent(this._id)];
  }

  deprecate(): DomainEvent[] {
    if (this._status === "DEPRECATED") return [];
    this._status = "DEPRECATED";
    this._touch();
    return [new ClassElementDeprecatedEvent(this._id)];
  }

  toJSON() {
    return {
      id: this._id,
      modelId: this._modelId,
      layer: this._layer.value,
      name: this._name,
      elementType: this._elementType.value,
      isAbstract: this._isAbstract,
      isStatic: this._isStatic,
      parentId: this._parentId,
      ordering: this._ordering,
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
export class ClassElementCreatedEvent extends DomainEvent {
  constructor(
    public readonly elementId: string,
    public readonly modelId: string,
    public readonly layer: Layer,
    public readonly name: string,
    public readonly elementType: ClassElementType
  ) {
    super("ClassElementCreated");
  }
}

export class ClassElementRenamedEvent extends DomainEvent {
  constructor(
    public readonly elementId: string,
    public readonly oldName: string,
    public readonly newName: string
  ) {
    super("ClassElementRenamed");
  }
}

export class ClassElementAbstractChangedEvent extends DomainEvent {
  constructor(
    public readonly elementId: string,
    public readonly isAbstract: boolean
  ) {
    super("ClassElementAbstractChanged");
  }
}

export class ClassElementStaticChangedEvent extends DomainEvent {
  constructor(
    public readonly elementId: string,
    public readonly isStatic: boolean
  ) {
    super("ClassElementStaticChanged");
  }
}

export class ClassElementParentChangedEvent extends DomainEvent {
  constructor(
    public readonly elementId: string,
    public readonly oldParentId: string | null,
    public readonly newParentId: string | null
  ) {
    super("ClassElementParentChanged");
  }
}

export class ClassElementOrderingChangedEvent extends DomainEvent {
  constructor(
    public readonly elementId: string,
    public readonly ordering: number
  ) {
    super("ClassElementOrderingChanged");
  }
}

export class ClassElementExtensionPropertyChangedEvent extends DomainEvent {
  constructor(
    public readonly elementId: string,
    public readonly key: string,
    public readonly value: unknown
  ) {
    super("ClassElementExtensionPropertyChanged");
  }
}

export class ClassElementValidatedEvent extends DomainEvent {
  constructor(public readonly elementId: string) {
    super("ClassElementValidated");
  }
}

export class ClassElementDeprecatedEvent extends DomainEvent {
  constructor(public readonly elementId: string) {
    super("ClassElementDeprecated");
  }
}