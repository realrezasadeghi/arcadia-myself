import { Entity } from "@/modules/shared/domain/entity";
import { Layer } from "../value-objects/layer";

export interface ModelProps {
  projectId: string;
  layer: Layer;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ArchitectureModel — Entity
 *
 * نمایانگر یک لایه معماری (OA/SA/LA/PA) درون یک پروژه.
 * هر پروژه حداکثر یک model از هر لایه می‌تواند داشته باشد.
 */
export class Model extends Entity<string> {
  private _name: string;
  private _description?: string;
  private readonly _projectId: string;
  private readonly _layer: Layer;
  private _updatedAt: Date;
  readonly createdAt: Date;

  private constructor(id: string, props: ModelProps) {
    super(id);
    this._projectId = props.projectId;
    this._layer = props.layer;
    this._name = props.name;
    this._description = props?.description;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id: string;
    projectId: string;
    layer: string;
    name: string;
    description?: string;
  }): Model {
    if (!props.name.trim()) throw new Error("Model name is required.");

    return new Model(props.id, {
      projectId: props.projectId,
      layer: Layer.from(props.layer),
      name: props.name.trim(),
      description: props.description ?? "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: {
    id: string;
    projectId: string;
    layer: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  }): Model {
    return new Model(props.id, {
      projectId: props.projectId,
      layer: Layer.from(props.layer),
      name: props.name,
      description: props.description,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  get projectId(): string {
    return this._projectId;
  }
  get layer(): Layer {
    return this._layer;
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

  rename(name?: string): void {
    if (!name || !name?.trim()) throw new Error("Model name can't empty");
    this._name = name.trim();
    this._updatedAt = new Date();
  }

  updateDescription(description?: string): void {
    this._description = description;
    this._updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this._id,
      projectId: this._projectId,
      layer: this._layer.value,
      name: this._name,
      description: this._description,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
