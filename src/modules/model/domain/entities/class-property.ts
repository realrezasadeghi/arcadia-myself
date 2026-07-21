import { Entity } from "@/modules/shared/domain/entity";
import { ClassVisibility } from "../value-objects/class-visibility";
import { ClassCollectionKind } from "../value-objects/class-collection-kind";

export type ClassPropertyStatus = "DRAFT" | "VALIDATED" | "DEPRECATED";

interface ClassPropertyProps {
  classElementId: string;
  modelId: string;
  layer: string;
  name: string;
  typeClassElementId: string | null;
  typeLiteral: string;
  isStatic: boolean;
  isReadOnly: boolean;
  isDerived: boolean;
  isID: boolean;
  visibility: ClassVisibility;
  multiplicityLower: number;
  multiplicityUpper: string;
  collectionKind: ClassCollectionKind;
  defaultValue: string;
  ordering: number;
  status: ClassPropertyStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class ClassProperty extends Entity<string> {
  private _classElementId: string;
  private _modelId: string;
  private _layer: string;
  private _name: string;
  private _typeClassElementId: string | null;
  private _typeLiteral: string;
  private _isStatic: boolean;
  private _isReadOnly: boolean;
  private _isDerived: boolean;
  private _isID: boolean;
  private _visibility: ClassVisibility;
  private _multiplicityLower: number;
  private _multiplicityUpper: string;
  private _collectionKind: ClassCollectionKind;
  private _defaultValue: string;
  private _ordering: number;
  private _status: ClassPropertyStatus;
  private _updatedAt: Date;
  readonly createdAt: Date;

  private constructor(id: string, props: ClassPropertyProps) {
    super(id);
    this._classElementId = props.classElementId;
    this._modelId = props.modelId;
    this._layer = props.layer;
    this._name = props.name;
    this._typeClassElementId = props.typeClassElementId;
    this._typeLiteral = props.typeLiteral;
    this._isStatic = props.isStatic;
    this._isReadOnly = props.isReadOnly;
    this._isDerived = props.isDerived;
    this._isID = props.isID;
    this._visibility = props.visibility;
    this._multiplicityLower = props.multiplicityLower;
    this._multiplicityUpper = props.multiplicityUpper;
    this._collectionKind = props.collectionKind;
    this._defaultValue = props.defaultValue;
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
    typeClassElementId?: string | null;
    typeLiteral?: string;
    isStatic?: boolean;
    isReadOnly?: boolean;
    isDerived?: boolean;
    isID?: boolean;
    visibility?: ClassVisibility;
    multiplicityLower?: number;
    multiplicityUpper?: string;
    collectionKind?: ClassCollectionKind;
    defaultValue?: string;
    ordering?: number;
    status?: ClassPropertyStatus;
  }): ClassProperty {
    if (!props.name.trim()) throw new Error("Property name is required");

    return new ClassProperty(props.id, {
      classElementId: props.classElementId,
      modelId: props.modelId,
      layer: props.layer,
      name: props.name.trim(),
      typeClassElementId: props.typeClassElementId ?? null,
      typeLiteral: props.typeLiteral ?? "",
      isStatic: props.isStatic ?? false,
      isReadOnly: props.isReadOnly ?? false,
      isDerived: props.isDerived ?? false,
      isID: props.isID ?? false,
      visibility: props.visibility ?? ClassVisibility.PUBLIC,
      multiplicityLower: props.multiplicityLower ?? 1,
      multiplicityUpper: props.multiplicityUpper ?? "1",
      collectionKind: props.collectionKind ?? ClassCollectionKind.NONE,
      defaultValue: props.defaultValue ?? "",
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
    typeClassElementId: string | null;
    typeLiteral: string;
    isStatic: boolean;
    isReadOnly: boolean;
    isDerived: boolean;
    isID: boolean;
    visibility: ClassVisibility;
    multiplicityLower: number;
    multiplicityUpper: string;
    collectionKind: ClassCollectionKind;
    defaultValue: string;
    ordering: number;
    status: ClassPropertyStatus;
    createdAt: string;
    updatedAt: string;
  }): ClassProperty {
    return new ClassProperty(props.id, {
      classElementId: props.classElementId,
      modelId: props.modelId,
      layer: props.layer,
      name: props.name,
      typeClassElementId: props.typeClassElementId,
      typeLiteral: props.typeLiteral,
      isStatic: props.isStatic,
      isReadOnly: props.isReadOnly,
      isDerived: props.isDerived,
      isID: props.isID,
      visibility: props.visibility,
      multiplicityLower: props.multiplicityLower,
      multiplicityUpper: props.multiplicityUpper,
      collectionKind: props.collectionKind,
      defaultValue: props.defaultValue,
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
  get typeClassElementId(): string | null {
    return this._typeClassElementId;
  }
  get typeLiteral(): string {
    return this._typeLiteral;
  }
  get isStatic(): boolean {
    return this._isStatic;
  }
  get isReadOnly(): boolean {
    return this._isReadOnly;
  }
  get isDerived(): boolean {
    return this._isDerived;
  }
  get isID(): boolean {
    return this._isID;
  }
  get visibility(): ClassVisibility {
    return this._visibility;
  }
  get multiplicityLower(): number {
    return this._multiplicityLower;
  }
  get multiplicityUpper(): string {
    return this._multiplicityUpper;
  }
  get collectionKind(): ClassCollectionKind {
    return this._collectionKind;
  }
  get defaultValue(): string {
    return this._defaultValue;
  }
  get ordering(): number {
    return this._ordering;
  }
  get status(): ClassPropertyStatus {
    return this._status;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  rename(name: string): void {
    if (!name.trim()) throw new Error("Property name can't be empty");
    this._name = name.trim();
    this._touch();
  }

  setTypeClassElementId(typeClassElementId: string | null): void {
    this._typeClassElementId = typeClassElementId;
    this._touch();
  }

  setTypeLiteral(typeLiteral: string): void {
    this._typeLiteral = typeLiteral;
    this._touch();
  }

  setStatic(isStatic: boolean): void {
    this._isStatic = isStatic;
    this._touch();
  }

  setReadOnly(isReadOnly: boolean): void {
    this._isReadOnly = isReadOnly;
    this._touch();
  }

  setDerived(isDerived: boolean): void {
    this._isDerived = isDerived;
    this._touch();
  }

  setID(isID: boolean): void {
    this._isID = isID;
    this._touch();
  }

  setVisibility(visibility: ClassVisibility): void {
    this._visibility = visibility;
    this._touch();
  }

  setMultiplicity(lower: number, upper: string): void {
    if (lower < 0) throw new Error("Multiplicity lower must be >= 0");
    this._multiplicityLower = lower;
    this._multiplicityUpper = upper;
    this._touch();
  }

  setCollectionKind(collectionKind: ClassCollectionKind): void {
    this._collectionKind = collectionKind;
    this._touch();
  }

  setDefaultValue(value: string): void {
    this._defaultValue = value;
    this._touch();
  }

  setOrdering(ordering: number): void {
    this._ordering = ordering;
    this._touch();
  }

  validate(): void {
    if (this._status === "DEPRECATED")
      throw new Error("Cannot validate a deprecated property");
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
      typeClassElementId: this._typeClassElementId,
      typeLiteral: this._typeLiteral,
      isStatic: this._isStatic,
      isReadOnly: this._isReadOnly,
      isDerived: this._isDerived,
      isID: this._isID,
      visibility: this._visibility.value,
      multiplicityLower: this._multiplicityLower,
      multiplicityUpper: this._multiplicityUpper,
      collectionKind: this._collectionKind.value,
      defaultValue: this._defaultValue,
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