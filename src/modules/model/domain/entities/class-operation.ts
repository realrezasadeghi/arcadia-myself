import { Entity } from "@/modules/shared/domain/entity";
import { ClassVisibility } from "../value-objects/class-visibility";

export type ClassOperationStatus = "DRAFT" | "VALIDATED" | "DEPRECATED";

interface ClassOperationProps {
  classElementId: string;
  modelId: string;
  layer: string;
  name: string;
  description: string;
  returnTypeClassElementId: string | null;
  returnTypeLiteral: string;
  returnMultiplicityLower: number;
  returnMultiplicityUpper: string;
  isStatic: boolean;
  isAbstract: boolean;
  isQuery: boolean;
  visibility: ClassVisibility;
  ordering: number;
  status: ClassOperationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class ClassOperation extends Entity<string> {
  private _name: string;
  private _description: string;
  private readonly _classElementId: string;
  private readonly _modelId: string;
  private readonly _layer: string;
  private _returnTypeClassElementId: string | null;
  private _returnTypeLiteral: string;
  private _returnMultiplicityLower: number;
  private _returnMultiplicityUpper: string;
  private _isStatic: boolean;
  private _isAbstract: boolean;
  private _isQuery: boolean;
  private _visibility: ClassVisibility;
  private _ordering: number;
  private _status: ClassOperationStatus;
  private _updatedAt: Date;
  readonly createdAt: Date;

  private constructor(id: string, props: ClassOperationProps) {
    super(id);
    this._classElementId = props.classElementId;
    this._modelId = props.modelId;
    this._layer = props.layer;
    this._name = props.name;
    this._description = props.description;
    this._returnTypeClassElementId = props.returnTypeClassElementId;
    this._returnTypeLiteral = props.returnTypeLiteral;
    this._returnMultiplicityLower = props.returnMultiplicityLower;
    this._returnMultiplicityUpper = props.returnMultiplicityUpper;
    this._isStatic = props.isStatic;
    this._isAbstract = props.isAbstract;
    this._isQuery = props.isQuery;
    this._visibility = props.visibility;
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
    description?: string;
    returnTypeClassElementId?: string | null;
    returnTypeLiteral?: string;
    returnMultiplicityLower?: number;
    returnMultiplicityUpper?: string;
    isStatic?: boolean;
    isAbstract?: boolean;
    isQuery?: boolean;
    visibility?: string;
    ordering?: number;
    status?: ClassOperationStatus;
  }): ClassOperation {
    if (!props.name.trim()) throw new Error("Operation name is required");

    return new ClassOperation(props.id, {
      classElementId: props.classElementId,
      modelId: props.modelId,
      layer: props.layer,
      name: props.name.trim(),
      description: props.description ?? "",
      returnTypeClassElementId: props.returnTypeClassElementId ?? null,
      returnTypeLiteral: props.returnTypeLiteral ?? "",
      returnMultiplicityLower: props.returnMultiplicityLower ?? 1,
      returnMultiplicityUpper: props.returnMultiplicityUpper ?? "1",
      isStatic: props.isStatic ?? false,
      isAbstract: props.isAbstract ?? false,
      isQuery: props.isQuery ?? false,
      visibility: ClassVisibility.from(props.visibility ?? "public"),
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
    description: string;
    returnTypeClassElementId: string | null;
    returnTypeLiteral: string;
    returnMultiplicityLower: number;
    returnMultiplicityUpper: string;
    isStatic: boolean;
    isAbstract: boolean;
    isQuery: boolean;
    visibility: string;
    ordering: number;
    status: ClassOperationStatus;
    createdAt: string;
    updatedAt: string;
  }): ClassOperation {
    return new ClassOperation(props.id, {
      classElementId: props.classElementId,
      modelId: props.modelId,
      layer: props.layer,
      name: props.name,
      description: props.description,
      returnTypeClassElementId: props.returnTypeClassElementId,
      returnTypeLiteral: props.returnTypeLiteral,
      returnMultiplicityLower: props.returnMultiplicityLower,
      returnMultiplicityUpper: props.returnMultiplicityUpper,
      isStatic: props.isStatic,
      isAbstract: props.isAbstract,
      isQuery: props.isQuery,
      visibility: ClassVisibility.from(props.visibility),
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
  get description(): string {
    return this._description;
  }
  get returnTypeClassElementId(): string | null {
    return this._returnTypeClassElementId;
  }
  get returnTypeLiteral(): string {
    return this._returnTypeLiteral;
  }
  get returnMultiplicityLower(): number {
    return this._returnMultiplicityLower;
  }
  get returnMultiplicityUpper(): string {
    return this._returnMultiplicityUpper;
  }
  get isStatic(): boolean {
    return this._isStatic;
  }
  get isAbstract(): boolean {
    return this._isAbstract;
  }
  get isQuery(): boolean {
    return this._isQuery;
  }
  get visibility(): ClassVisibility {
    return this._visibility;
  }
  get ordering(): number {
    return this._ordering;
  }
  get status(): ClassOperationStatus {
    return this._status;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  rename(name: string): void {
    if (!name.trim()) throw new Error("Operation name can't be empty");
    this._name = name.trim();
    this._touch();
  }

  setDescription(description: string): void {
    this._description = description;
    this._touch();
  }

  setReturnTypeClassElementId(returnTypeClassElementId: string | null): void {
    this._returnTypeClassElementId = returnTypeClassElementId;
    this._touch();
  }

  setReturnTypeLiteral(returnTypeLiteral: string): void {
    this._returnTypeLiteral = returnTypeLiteral;
    this._touch();
  }

  setReturnMultiplicity(lower: number, upper: string): void {
    if (lower < 0) throw new Error("Return multiplicity lower must be >= 0");
    this._returnMultiplicityLower = lower;
    this._returnMultiplicityUpper = upper;
    this._touch();
  }

  setStatic(isStatic: boolean): void {
    this._isStatic = isStatic;
    this._touch();
  }

  setAbstract(isAbstract: boolean): void {
    this._isAbstract = isAbstract;
    this._touch();
  }

  setQuery(isQuery: boolean): void {
    this._isQuery = isQuery;
    this._touch();
  }

  setVisibility(visibility: string): void {
    this._visibility = ClassVisibility.from(visibility);
    this._touch();
  }

  setOrdering(ordering: number): void {
    this._ordering = ordering;
    this._touch();
  }

  validate(): void {
    if (this._status === "DEPRECATED")
      throw new Error("Cannot validate a deprecated operation");
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
      description: this._description,
      returnTypeClassElementId: this._returnTypeClassElementId,
      returnTypeLiteral: this._returnTypeLiteral,
      returnMultiplicityLower: this._returnMultiplicityLower,
      returnMultiplicityUpper: this._returnMultiplicityUpper,
      isStatic: this._isStatic,
      isAbstract: this._isAbstract,
      isQuery: this._isQuery,
      visibility: this._visibility.value,
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