import { Entity } from "@/modules/shared/domain/entity";

export type ClassEnumerationLiteralStatus =
  | "DRAFT"
  | "VALIDATED"
  | "DEPRECATED";

interface ClassEnumerationLiteralProps {
  classElementId: string;
  modelId: string;
  layer: string;
  name: string;
  value: string;
  ordering: number;
  status: ClassEnumerationLiteralStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class ClassEnumerationLiteral extends Entity<string> {
  private _name: string;
  private readonly _classElementId: string;
  private readonly _modelId: string;
  private readonly _layer: string;
  private _value: string;
  private _ordering: number;
  private _status: ClassEnumerationLiteralStatus;
  private _updatedAt: Date;
  readonly createdAt: Date;

  private constructor(id: string, props: ClassEnumerationLiteralProps) {
    super(id);
    this._classElementId = props.classElementId;
    this._modelId = props.modelId;
    this._layer = props.layer;
    this._name = props.name;
    this._value = props.value;
    this._ordering = props.ordering;
    this._status = props.status;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id: string;
    classElementId: string;
    modelId: string;
    layer: string;
    name: string;
    value?: string;
    ordering?: number;
    status?: ClassEnumerationLiteralStatus;
  }): ClassEnumerationLiteral {
    if (!props.name.trim())
      throw new Error("Enumeration literal name is required");

    return new ClassEnumerationLiteral(props.id, {
      classElementId: props.classElementId,
      modelId: props.modelId,
      layer: props.layer,
      name: props.name.trim(),
      value: props.value ?? "",
      ordering: props.ordering ?? 0,
      status: props.status ?? "DRAFT",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: {
    id: string;
    classElementId: string;
    modelId: string;
    layer: string;
    name: string;
    value: string;
    ordering: number;
    status: ClassEnumerationLiteralStatus;
    createdAt: string;
    updatedAt: string;
  }): ClassEnumerationLiteral {
    return new ClassEnumerationLiteral(props.id, {
      classElementId: props.classElementId,
      modelId: props.modelId,
      layer: props.layer,
      name: props.name,
      value: props.value,
      ordering: props.ordering,
      status: props.status,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  get classElementId(): string {
    return this._classElementId;
  }
  get modelId(): string {
    return this._modelId;
  }
  get layer(): string {
    return this._layer;
  }
  get name(): string {
    return this._name;
  }
  get value(): string {
    return this._value;
  }
  get ordering(): number {
    return this._ordering;
  }
  get status(): ClassEnumerationLiteralStatus {
    return this._status;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  rename(name: string): void {
    if (!name.trim())
      throw new Error("Enumeration literal name can't be empty");
    this._name = name.trim();
    this._touch();
  }

  setValue(value: string): void {
    this._value = value;
    this._touch();
  }

  setOrdering(ordering: number): void {
    this._ordering = ordering;
    this._touch();
  }

  validate(): void {
    if (this._status === "DEPRECATED")
      throw new Error("Cannot validate a deprecated enumeration literal");
    this._status = "VALIDATED";
    this._touch();
  }

  deprecate(): void {
    this._status = "DEPRECATED";
    this._touch();
  }

  toJSON() {
    return {
      id: this._id,
      classElementId: this._classElementId,
      modelId: this._modelId,
      layer: this._layer,
      name: this._name,
      value: this._value,
      ordering: this._ordering,
      status: this._status,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }
}
