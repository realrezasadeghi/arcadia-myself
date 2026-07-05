import { Entity } from "@/modules/shared/domain/entity";
import { DiagramType } from "../value-objects/diagram-type";

interface DiagramProps {
  modelId: string;
  type: DiagramType;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Diagram — Entity (Metadata only)
 *
 * Visual layout (viewport, element positions) is stored separately
 * in the DiagramLayout value object / diagram_layouts table.
 */
export class Diagram extends Entity<string> {
  private _name: string;
  private _description?: string;
  private readonly _modelId: string;
  private readonly _type: DiagramType;
  private _updatedAt: Date;
  readonly createdAt: Date;

  private constructor(id: string, props: DiagramProps) {
    super(id);
    this._modelId = props.modelId;
    this._type = props.type;
    this._name = props.name;
    this._description = props.description;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id: string;
    modelId: string;
    type: string;
    name: string;
    description?: string;
  }): Diagram {
    if (!props.name.trim()) throw new Error("Diagram name is required");

    return new Diagram(props.id, {
      modelId: props.modelId,
      type: DiagramType.from(props.type),
      name: props.name.trim(),
      description: props.description ?? "",
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
    createdAt: string;
    updatedAt: string;
  }): Diagram {
    return new Diagram(props.id, {
      modelId: props.modelId,
      type: DiagramType.from(props.type),
      name: props.name,
      description: props.description,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  get modelId(): string {
    return this._modelId;
  }
  get type(): DiagramType {
    return this._type;
  }
  get name(): string {
    return this._name;
  }
  get description(): string | undefined {
    return this._description;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  rename(name: string): void {
    if (!name.trim()) throw new Error("Diagram name can't empty");
    this._name = name.trim();
    this._touch();
  }

  updateDescription(description?: string): void {
    this._description = description;
    this._touch();
  }

  toJSON() {
    return {
      id: this._id,
      modelId: this._modelId,
      type: this._type.value,
      name: this._name,
      description: this._description,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }
}
