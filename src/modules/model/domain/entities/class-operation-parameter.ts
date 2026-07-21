import { Entity } from "@/modules/shared/domain/entity";
import { ClassParameterDirection } from "../value-objects/class-parameter-direction";

export type ClassOperationParameterStatus = "DRAFT" | "VALIDATED" | "DEPRECATED";

interface ClassOperationParameterProps {
  classOperationId: string;
  modelId: string;
  layer: string;
  name: string;
  typeClassElementId: string | null;
  multiplicityLower: number;
  multiplicityUpper: string;
  defaultValue: string | null;
  direction: ClassParameterDirection;
  isOrdered: boolean;
  isUnique: boolean;
  ordering: number;
  status: ClassOperationParameterStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class ClassOperationParameter extends Entity<string> {
  private _classOperationId: string;
  private _modelId: string;
  private _layer: string;
  private _name: string;
  private _typeClassElementId: string | null;
  private _multiplicityLower: number;
  private _multiplicityUpper: string;
  private _defaultValue: string | null;
  private _direction: ClassParameterDirection;
  private _isOrdered: boolean;
  private _isUnique: boolean;
  private _ordering: number;
  private _status: ClassOperationParameterStatus;
  private _updatedAt: Date;
  readonly createdAt: Date;

  private constructor(id: string, props: ClassOperationParameterProps) {
    super(id);
    this._classOperationId = props.classOperationId;
    this._modelId = props.modelId;
    this._layer = props.layer;
    this._name = props.name;
    this._typeClassElementId = props.typeClassElementId;
    this._multiplicityLower = props.multiplicityLower;
    this._multiplicityUpper = props.multiplicityUpper;
    this._defaultValue = props.defaultValue;
    this._direction = props.direction;
    this._isOrdered = props.isOrdered;
    this._isUnique = props.isUnique;
    this._ordering = props.ordering;
    this._status = props.status;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id: string;
    classOperationId: string;
    modelId: string;
    layer: string;
    name: string;
    typeClassElementId?: string | null;
    multiplicityLower?: number;
    multiplicityUpper?: string;
    defaultValue?: string | null;
    direction?: "IN" | "OUT" | "INOUT";
    isOrdered?: boolean;
    isUnique?: boolean;
    ordering?: number;
    status?: ClassOperationParameterStatus;
  }): ClassOperationParameter {
    if (!props.name.trim()) throw new Error("Parameter name is required");

    return new ClassOperationParameter(props.id, {
      classOperationId: props.classOperationId,
      modelId: props.modelId,
      layer: props.layer,
      name: props.name.trim(),
      typeClassElementId: props.typeClassElementId ?? null,
      multiplicityLower: props.multiplicityLower ?? 1,
      multiplicityUpper: props.multiplicityUpper ?? "1",
      defaultValue: props.defaultValue ?? null,
      direction: ClassParameterDirection.from(props.direction ?? "IN"),
      isOrdered: props.isOrdered ?? false,
      isUnique: props.isUnique ?? false,
      ordering: props.ordering ?? 0,
      status: props.status ?? "DRAFT",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: {
    id: string;
    classOperationId: string;
    modelId: string;
    layer: string;
    name: string;
    typeClassElementId: string | null;
    multiplicityLower: number;
    multiplicityUpper: string;
    defaultValue: string | null;
    direction: string;
    isOrdered: boolean;
    isUnique: boolean;
    ordering: number;
    status: ClassOperationParameterStatus;
    createdAt: string;
    updatedAt: string;
  }): ClassOperationParameter {
    return new ClassOperationParameter(props.id, {
      classOperationId: props.classOperationId,
      modelId: props.modelId,
      layer: props.layer,
      name: props.name,
      typeClassElementId: props.typeClassElementId,
      multiplicityLower: props.multiplicityLower,
      multiplicityUpper: props.multiplicityUpper,
      defaultValue: props.defaultValue,
      direction: ClassParameterDirection.from(props.direction),
      isOrdered: props.isOrdered,
      isUnique: props.isUnique,
      ordering: props.ordering,
      status: props.status,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  get classOperationId(): string {
    return this._classOperationId;
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
  get typeClassElementId(): string | null {
    return this._typeClassElementId;
  }
  get multiplicityLower(): number {
    return this._multiplicityLower;
  }
  get multiplicityUpper(): string {
    return this._multiplicityUpper;
  }
  get defaultValue(): string | null {
    return this._defaultValue;
  }
  get isOrdered(): boolean {
    return this._isOrdered;
  }
  get isUnique(): boolean {
    return this._isUnique;
  }
  get direction(): ClassParameterDirection {
    return this._direction;
  }
  get ordering(): number {
    return this._ordering;
  }
  get status(): ClassOperationParameterStatus {
    return this._status;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  rename(name: string): void {
    if (!name.trim()) throw new Error("Parameter name can't be empty");
    this._name = name.trim();
    this._touch();
  }

  setTypeClassElementId(typeClassElementId: string | null): void {
    this._typeClassElementId = typeClassElementId;
    this._touch();
  }

  setMultiplicity(lower: number, upper: string): void {
    if (lower < 0) throw new Error("Multiplicity lower must be >= 0");
    this._multiplicityLower = lower;
    this._multiplicityUpper = upper;
    this._touch();
  }

  setDefaultValue(value: string | null): void {
    this._defaultValue = value;
    this._touch();
  }

  setOrdered(isOrdered: boolean): void {
    this._isOrdered = isOrdered;
    this._touch();
  }

  setUnique(isUnique: boolean): void {
    this._isUnique = isUnique;
    this._touch();
  }

  setDirection(direction: ClassParameterDirection): void {
    this._direction = direction;
    this._touch();
  }

  setOrdering(ordering: number): void {
    this._ordering = ordering;
    this._touch();
  }

  validate(): void {
    if (this._status === "DEPRECATED")
      throw new Error("Cannot validate a deprecated parameter");
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
      classOperationId: this._classOperationId,
      modelId: this._modelId,
      layer: this._layer,
      name: this._name,
      typeClassElementId: this._typeClassElementId,
      multiplicityLower: this._multiplicityLower,
      multiplicityUpper: this._multiplicityUpper,
      defaultValue: this._defaultValue,
      direction: this._direction.value,
      isOrdered: this._isOrdered,
      isUnique: this._isUnique,
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