import { Entity } from "@/modules/shared/domain/entity";
import { ElementType } from "../value-objects/element-type";

export type ElementStatus = "DRAFT" | "VALIDATED" | "DEPRECATED";

export type ElementProperties = {
  status: ElementStatus;
  stereotype?: string;
  [key: string]: unknown;
};

type ModelElementProps = {
  modelId: string;
  type: ElementType;
  name: string;
  description?: string;
  properties: ElementProperties;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * ModelElement — Entity
 *
 * یک المنت معماری درون یک لایه.
 * دارای هویت مستقل — می‌تواند در چندین Diagram نمایش داشته باشد.
 * Business behavior: تغییر وضعیت، اعتبارسنجی نام.
 */
export class ModelElement extends Entity<string> {
  private _name: string;
  private _description?: string;
  private readonly _modelId: string;
  private readonly _type: ElementType;
  private _properties: ElementProperties;
  private _updatedAt: Date;
  readonly createdAt: Date;

  private constructor(id: string, props: ModelElementProps) {
    super(id);
    this._modelId = props.modelId;
    this._type = props.type;
    this._name = props.name;
    this._description = props.description;
    this._properties = { ...props.properties };
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id: string;
    modelId: string;
    type: string;
    name: string;
    description?: string;
    properties?: Partial<ElementProperties>;
  }): ModelElement {
    if (!props.name.trim()) throw new Error("Element name is required");

    return new ModelElement(props.id, {
      modelId: props.modelId,
      type: ElementType.from(props.type),
      name: props.name.trim(),
      description: props.description ?? "",
      properties: { status: "DRAFT", ...props.properties },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: {
    id: string;
    modelId: string;
    type: string;
    name: string;
    description: string;
    properties: ElementProperties;
    createdAt: string;
    updatedAt: string;
  }): ModelElement {
    return new ModelElement(props.id, {
      modelId: props.modelId,
      type: ElementType.from(props.type),
      name: props.name,
      description: props.description,
      properties: props.properties,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  get modelId(): string {
    return this._modelId;
  }
  get type(): ElementType {
    return this._type;
  }
  get name(): string {
    return this._name;
  }
  get description(): string | undefined {
    return this._description;
  }
  get properties(): Readonly<ElementProperties> {
    return this._properties;
  }
  get status(): ElementStatus {
    return this._properties.status;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  rename(name: string): void {
    if (!name.trim()) throw new Error("Element name can't empty");
    this._name = name.trim();
    this._touch();
  }

  updateDescription(description?: string): void {
    this._description = description;
    this._touch();
  }

  validate(): void {
    if (this._properties.status === "DEPRECATED") {
      throw new Error("Element deprecate and has't ability");
    }
    this._properties = { ...this._properties, status: "VALIDATED" };
    this._touch();
  }

  deprecate(): void {
    this._properties = { ...this._properties, status: "DEPRECATED" };
    this._touch();
  }

  updateProperties(partial: Partial<ElementProperties>): void {
    this._properties = { ...this._properties, ...partial };
    this._touch();
  }

  isDeprecated(): boolean {
    return this._properties.status === "DEPRECATED";
  }
  isValidated(): boolean {
    return this._properties.status === "VALIDATED";
  }

  toJSON() {
    return {
      id: this._id,
      modelId: this._modelId,
      type: this._type.value,
      name: this._name,
      description: this._description,
      properties: this._properties,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }
}
