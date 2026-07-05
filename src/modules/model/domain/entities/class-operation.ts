import { Entity } from "@/modules/shared/domain/entity";
import type { ParameterDirectionValue } from "../value-objects/parameter-direction";
import type { VisibilityValue } from "../value-objects/visibility";

export interface OperationParameter {
  name: string;
  type: string;
  direction: ParameterDirectionValue;
  description?: string;
}

interface ClassOperationProps {
  classElementId: string;
  name: string;
  returnType: string;
  visibility: VisibilityValue;
  isStatic: boolean;
  isAbstract: boolean;
  parameters: OperationParameter[];
  description: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ClassOperation — Entity
 *
 * An operation (method) of a class element in a class diagram.
 */
export class ClassOperation extends Entity<string> {
  private _name: string;
  private _returnType: string;
  private _visibility: VisibilityValue;
  private _isStatic: boolean;
  private _isAbstract: boolean;
  private _parameters: OperationParameter[];
  private _description: string | null;
  private _order: number;
  private _updatedAt: Date;
  readonly createdAt: Date;
  private readonly _classElementId: string;

  private constructor(id: string, props: ClassOperationProps) {
    super(id);
    this._classElementId = props.classElementId;
    this._name = props.name;
    this._returnType = props.returnType;
    this._visibility = props.visibility;
    this._isStatic = props.isStatic;
    this._isAbstract = props.isAbstract;
    this._parameters = [...props.parameters];
    this._description = props.description;
    this._order = props.order;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id: string;
    classElementId: string;
    name: string;
    returnType?: string;
    visibility?: VisibilityValue;
    isStatic?: boolean;
    isAbstract?: boolean;
    parameters?: OperationParameter[];
    description?: string | null;
    order?: number;
  }): ClassOperation {
    if (!props.name.trim()) throw new Error("Operation name is required");

    return new ClassOperation(props.id, {
      classElementId: props.classElementId,
      name: props.name.trim(),
      returnType: props.returnType ?? "void",
      visibility: props.visibility ?? "public",
      isStatic: props.isStatic ?? false,
      isAbstract: props.isAbstract ?? false,
      parameters: props.parameters ?? [],
      description: props.description ?? null,
      order: props.order ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: {
    id: string;
    classElementId: string;
    name: string;
    returnType: string;
    visibility: VisibilityValue;
    isStatic: boolean;
    isAbstract: boolean;
    parameters: OperationParameter[];
    description: string | null;
    order: number;
    createdAt: string;
    updatedAt: string;
  }): ClassOperation {
    return new ClassOperation(props.id, {
      classElementId: props.classElementId,
      name: props.name,
      returnType: props.returnType,
      visibility: props.visibility,
      isStatic: props.isStatic,
      isAbstract: props.isAbstract,
      parameters: props.parameters,
      description: props.description,
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
  get returnType(): string {
    return this._returnType;
  }
  get visibility(): VisibilityValue {
    return this._visibility;
  }
  get isStatic(): boolean {
    return this._isStatic;
  }
  get isAbstract(): boolean {
    return this._isAbstract;
  }
  get parameters(): ReadonlyArray<OperationParameter> {
    return this._parameters;
  }
  get description(): string | null {
    return this._description;
  }
  get order(): number {
    return this._order;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  /** Display string like "+ name(param: Type): ReturnType" */
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
    const abstractMod = this._isAbstract ? "{abstract} " : "";
    const params = this._parameters
      .map((p) => `${p.name}: ${p.type}`)
      .join(", ");
    return `${vis} ${staticMod}${abstractMod}${this._name}(${params}): ${this._returnType}`;
  }

  rename(name: string): void {
    if (!name.trim()) throw new Error("Operation name can't be empty");
    this._name = name.trim();
    this._touch();
  }

  updateReturnType(type: string): void {
    if (!type.trim()) throw new Error("Return type can't be empty");
    this._returnType = type.trim();
    this._touch();
  }

  updateVisibility(visibility: VisibilityValue): void {
    this._visibility = visibility;
    this._touch();
  }

  updateModifiers(partial: { isStatic?: boolean; isAbstract?: boolean }): void {
    if (partial.isStatic !== undefined) this._isStatic = partial.isStatic;
    if (partial.isAbstract !== undefined) this._isAbstract = partial.isAbstract;
    this._touch();
  }

  addParameter(param: OperationParameter): void {
    this._parameters.push(param);
    this._touch();
  }

  removeParameter(index: number): void {
    if (index < 0 || index >= this._parameters.length) {
      throw new Error("Parameter index out of range");
    }
    this._parameters.splice(index, 1);
    this._touch();
  }

  updateParameter(index: number, param: OperationParameter): void {
    if (index < 0 || index >= this._parameters.length) {
      throw new Error("Parameter index out of range");
    }
    this._parameters[index] = param;
    this._touch();
  }

  updateParameters(params: OperationParameter[]): void {
    this._parameters = [...params];
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
      returnType: this._returnType,
      visibility: this._visibility,
      isStatic: this._isStatic,
      isAbstract: this._isAbstract,
      parameters: this._parameters,
      description: this._description,
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
