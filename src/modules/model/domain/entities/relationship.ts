import { Entity } from "@/modules/shared/domain/entity";
import type { SemanticRelation } from "../core/interfaces";
import { RelationshipType } from "../value-objects/relationship-type";

export type ExchangeKind = "FLOW" | "EVENT" | "OPERATION";

export interface RelationshipProperties {
  exchangeKind?: ExchangeKind;
  conveyedItems?: string[];
  protocol?: string;
  [key: string]: unknown;
}

interface RelationshipProps {
  modelId: string;
  type: RelationshipType;
  sourceElementId: string;
  targetElementId: string;
  name: string;
  description: string;
  properties: RelationshipProperties;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Relationship — Entity
 *
 * یک رابطه بین دو المنت در یک لایه.
 * Validation قبل از ساخت توسط ConnectionPolicy انجام می‌شود.
 */
export class Relationship extends Entity<string> implements SemanticRelation {
  private _name: string;
  private _description?: string;
  private _properties: RelationshipProperties;
  private readonly _modelId: string;
  private readonly _type: RelationshipType;
  private readonly _sourceElementId: string;
  private readonly _targetElementId: string;
  private _updatedAt: Date;
  readonly createdAt: Date;

  private constructor(id: string, props: RelationshipProps) {
    super(id);
    this._modelId = props.modelId;
    this._type = props.type;
    this._sourceElementId = props.sourceElementId;
    this._targetElementId = props.targetElementId;
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
    sourceElementId: string;
    targetElementId: string;
    name?: string;
    description?: string;
    properties?: RelationshipProperties;
  }): Relationship {
    return new Relationship(props.id, {
      modelId: props.modelId,
      type: RelationshipType.from(props.type),
      sourceElementId: props.sourceElementId,
      targetElementId: props.targetElementId,
      name: props.name ?? "",
      description: props.description ?? "",
      properties: props.properties ?? {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: {
    id: string;
    modelId: string;
    type: string;
    sourceElementId: string;
    targetElementId: string;
    name: string;
    description: string;
    properties: RelationshipProperties;
    createdAt: string;
    updatedAt: string;
  }): Relationship {
    return new Relationship(props.id, {
      modelId: props.modelId,
      type: RelationshipType.from(props.type),
      sourceElementId: props.sourceElementId,
      targetElementId: props.targetElementId,
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
  get type(): RelationshipType {
    return this._type;
  }
  get sourceElementId(): string {
    return this._sourceElementId;
  }
  get targetElementId(): string {
    return this._targetElementId;
  }
  get sourceId(): string {
    return this._sourceElementId;
  }
  get targetId(): string {
    return this._targetElementId;
  }
  get name(): string {
    return this._name;
  }
  get description(): string | undefined {
    return this._description;
  }
  get properties(): Readonly<RelationshipProperties> {
    return this._properties;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  rename(name?: string): void {
    if (!name || !name.trim()) {
      throw new Error("Relationship name can't empty");
    }
    this._name = name;
    this._updatedAt = new Date();
  }

  updateDescription(description?: string): void {
    this._description = description;
    this._updatedAt = new Date();
  }

  updateProperties(partial: Partial<RelationshipProperties>): void {
    this._properties = { ...this._properties, ...partial };
    this._updatedAt = new Date();
  }

  /** آیا این رابطه به المنت داده‌شده متصل است؟ */
  involves(elementId: string): boolean {
    return (
      this._sourceElementId === elementId || this._targetElementId === elementId
    );
  }

  toJSON() {
    return {
      id: this._id,
      modelId: this._modelId,
      type: this._type.value,
      sourceElementId: this._sourceElementId,
      targetElementId: this._targetElementId,
      name: this._name,
      description: this._description,
      properties: this._properties,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
