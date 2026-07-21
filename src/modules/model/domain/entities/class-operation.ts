import { Entity } from "@/modules/shared/domain/entity";
import { ClassVisibility } from "../value-objects/class-visibility";

export type ClassOperationStatus = "DRAFT" | "VALIDATED" | "DEPRECATED";

interface ClassOperationProps {
  classElementId: string;
  modelId: string;
  layer: string;
  name: string;
  returnTypeClassElementId: string | null;
  returnTypeLiteral: string;
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
  private readonly _classElementId: string;
  private readonly _modelId: string;
  private readonly _layer: string;
  private _returnTypeClassElementId: string | null;
  private _returnTypeLiteral: string;
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
    this._returnTypeClassElementId = props.returnTypeClassElementId;
    this._returnTypeLiteral = props.returnTypeLiteral;
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
    returnTypeClassElementId?: string | null;
    returnTypeLiteral?: string;
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
      returnTypeClassElementId: props.returnTypeClassElementId ?? null,
      returnTypeLiteral: props.returnTypeLiteral ?? "",
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
    returnTypeClassElementId: string | null;
    returnTypeLiteral: string;
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
      returnTypeClassElementId: props.returnTypeClassElementId,
      returnTypeLiteral: props.returnTypeLiteral,
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
  get returnTypeClassElementId(): string | null {
    return this._returnTypeClassElementId;
  }
  get returnTypeLiteral(): string {
    return this._returnTypeLiteral;
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

  setReturnTypeClassElementId(returnTypeClassElementId: string | null): void {
    this._returnTypeClassElementId = returnTypeClassElementId;
    this._touch();
  }

  setReturnTypeLiteral(returnTypeLiteral: string): void {
    this._returnTypeLiteral = returnTypeLiteral;
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
      returnTypeClassElementId: this._returnTypeClassElementId,
      returnTypeLiteral: this._returnTypeLiteral,
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