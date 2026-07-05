import { Entity } from "@/modules/shared/domain/entity";
import type { VisibilityValue } from "../value-objects/visibility";

interface ClassAttributeProps {
  classElementId: string;
  name: string;
  type: string;
  visibility: VisibilityValue;
  isStatic: boolean;
  isReadOnly: boolean;
  isOptional: boolean;
  defaultValue: string | null;
  description: string | null;
  multiplicityLower: number;
  multiplicityUpper: number | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ClassAttribute — Entity
 *
 * An attribute of a class element in a class diagram.
 */
export class ClassAttribute extends Entity<string> {
  private _name: string;
  private _type: string;
  private _visibility: VisibilityValue;
  private _isStatic: boolean;
  private _isReadOnly: boolean;
  private _isOptional: boolean;
  private _defaultValue: string | null;
  private _description: string | null;
  private _multiplicityLower: number;
  private _multiplicityUpper: number | null;
  private _order: number;
  private _updatedAt: Date;
  readonly createdAt: Date;
  private readonly _classElementId: string;

  private constructor(id: string, props: ClassAttributeProps) {
    super(id);
    this._classElementId = props.classElementId;
    this._name = props.name;
    this._type = props.type;
    this._visibility = props.visibility;
    this._isStatic = props.isStatic;
    this._isReadOnly = props.isReadOnly;
    this._isOptional = props.isOptional;
    this._defaultValue = props.defaultValue;
    this._description = props.description;
    this._multiplicityLower = props.multiplicityLower;
    this._multiplicityUpper = props.multiplicityUpper;
    this._order = props.order;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id: string;
    classElementId: string;
    name: string;
    type: string;
    visibility?: VisibilityValue;
    isStatic?: boolean;
    isReadOnly?: boolean;
    isOptional?: boolean;
    defaultValue?: string | null;
    description?: string | null;
    multiplicityLower?: number;
    multiplicityUpper?: number | null;
    order?: number;
  }): ClassAttribute {
    if (!props.name.trim()) throw new Error("Attribute name is required");
    if (!props.type.trim()) throw new Error("Attribute type is required");

    return new ClassAttribute(props.id, {
      classElementId: props.classElementId,
      name: props.name.trim(),
      type: props.type.trim(),
      visibility: props.visibility ?? "public",
      isStatic: props.isStatic ?? false,
      isReadOnly: props.isReadOnly ?? false,
      isOptional: props.isOptional ?? false,
      defaultValue: props.defaultValue ?? null,
      description: props.description ?? null,
      multiplicityLower: props.multiplicityLower ?? 1,
      multiplicityUpper: props.multiplicityUpper ?? null,
      order: props.order ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: {
    id: string;
    classElementId: string;
    name: string;
    type: string;
    visibility: VisibilityValue;
    isStatic: boolean;
    isReadOnly: boolean;
    isOptional: boolean;
    defaultValue: string | null;
    description: string | null;
    multiplicityLower: number;
    multiplicityUpper: number | null;
    order: number;
    createdAt: string;
    updatedAt: string;
  }): ClassAttribute {
    return new ClassAttribute(props.id, {
      classElementId: props.classElementId,
      name: props.name,
      type: props.type,
      visibility: props.visibility,
      isStatic: props.isStatic,
      isReadOnly: props.isReadOnly,
      isOptional: props.isOptional,
      defaultValue: props.defaultValue,
      description: props.description,
      multiplicityLower: props.multiplicityLower,
      multiplicityUpper: props.multiplicityUpper,
      order: props.order,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  get classElementId(): string {
    return this._classElementId;
  }
  get name(): string {
    return this._name;
  }
  get type(): string {
    return this._type;
  }
  get visibility(): VisibilityValue {
    return this._visibility;
  }
  get isStatic(): boolean {
    return this._isStatic;
  }
  get isReadOnly(): boolean {
    return this._isReadOnly;
  }
  get isOptional(): boolean {
    return this._isOptional;
  }
  get defaultValue(): string | null {
    return this._defaultValue;
  }
  get description(): string | null {
    return this._description;
  }
  get multiplicityLower(): number {
    return this._multiplicityLower;
  }
  get multiplicityUpper(): number | null {
    return this._multiplicityUpper;
  }
  get order(): number {
    return this._order;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  /** Display string like "+ name: Type" */
  get displayString(): string {
    const vis =
      this._visibility === "public"
        ? "+"
        : this._visibility === "private"
          ? "-"
          : this._visibility === "protected"
            ? "#"
            : "~";
    const staticMod = this._isStatic ? "{static} " : "";
    const mult =
      this._multiplicityUpper === null
        ? this._multiplicityLower === 0
          ? " [*]"
          : ` [${this._multiplicityLower}..*]`
        : this._multiplicityLower === this._multiplicityUpper
          ? this._multiplicityLower === 1
            ? ""
            : ` [${this._multiplicityLower}]`
          : ` [${this._multiplicityLower}..${this._multiplicityUpper}]`;
    return `${vis} ${staticMod}${this._name}: ${this._type}${mult}`;
  }

  rename(name: string): void {
    if (!name.trim()) throw new Error("Attribute name can't be empty");
    this._name = name.trim();
    this._touch();
  }

  updateType(type: string): void {
    if (!type.trim()) throw new Error("Attribute type can't be empty");
    this._type = type.trim();
    this._touch();
  }

  updateVisibility(visibility: VisibilityValue): void {
    this._visibility = visibility;
    this._touch();
  }

  updateModifiers(partial: {
    isStatic?: boolean;
    isReadOnly?: boolean;
    isOptional?: boolean;
  }): void {
    if (partial.isStatic !== undefined) this._isStatic = partial.isStatic;
    if (partial.isReadOnly !== undefined) this._isReadOnly = partial.isReadOnly;
    if (partial.isOptional !== undefined) this._isOptional = partial.isOptional;
    this._touch();
  }

  updateMultiplicity(lower: number, upper: number | null): void {
    if (lower < 0) throw new Error("Lower bound cannot be negative");
    if (upper !== null && upper < lower) {
      throw new Error("Upper bound cannot be less than lower bound");
    }
    this._multiplicityLower = lower;
    this._multiplicityUpper = upper;
    this._touch();
  }

  updateDefaultValue(value: string | null): void {
    this._defaultValue = value;
    this._touch();
  }

  updateDescription(description: string | null): void {
    this._description = description;
    this._touch();
  }

  updateOrder(order: number): void {
    this._order = order;
    this._touch();
  }

  toJSON() {
    return {
      id: this._id,
      classElementId: this._classElementId,
      name: this._name,
      type: this._type,
      visibility: this._visibility,
      isStatic: this._isStatic,
      isReadOnly: this._isReadOnly,
      isOptional: this._isOptional,
      defaultValue: this._defaultValue,
      description: this._description,
      multiplicityLower: this._multiplicityLower,
      multiplicityUpper: this._multiplicityUpper,
      order: this._order,
      displayString: this.displayString,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }
}
