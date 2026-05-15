import { Entity } from "@/modules/shared/domain/entity";
import { Layer } from "../value-objects/layer";
import { TraceLinkType } from "../value-objects/trace-link";

interface TraceLinkProps {
  projectId: string;
  type: TraceLinkType;
  sourceElementId: string;
  sourceLayer: Layer;
  targetElementId: string;
  targetLayer: Layer;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * TraceLink — Entity
 *
 * پیوند ردیابی بین دو المنت از لایه‌های مختلف.
 * Validation توسط TracePolicy قبل از ساخت انجام می‌شود.
 * این Entity خودش invariant اساسی را enforce می‌کند:
 * source و target نمی‌توانند همان المنت باشند.
 */
export class TraceLink extends Entity<string> {
  private _description?: string;
  private readonly _projectId: string;
  private readonly _type: TraceLinkType;
  private readonly _sourceElementId: string;
  private readonly _sourceLayer: Layer;
  private readonly _targetElementId: string;
  private readonly _targetLayer: Layer;
  private _updatedAt: Date;
  readonly createdAt: Date;

  private constructor(id: string, props: TraceLinkProps) {
    super(id);
    this._projectId = props.projectId;
    this._type = props.type;
    this._sourceElementId = props.sourceElementId;
    this._sourceLayer = props.sourceLayer;
    this._targetElementId = props.targetElementId;
    this._targetLayer = props.targetLayer;
    this._description = props.description;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id: string;
    projectId: string;
    type: string;
    sourceElementId: string;
    sourceLayer: string;
    targetElementId: string;
    targetLayer: string;
    description?: string;
  }): TraceLink {
    return new TraceLink(props.id, {
      projectId: props.projectId,
      type: TraceLinkType.from(props.type),
      sourceElementId: props.sourceElementId,
      sourceLayer: Layer.from(props.sourceLayer),
      targetElementId: props.targetElementId,
      targetLayer: Layer.from(props.targetLayer),
      description: props.description ?? "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: {
    id: string;
    projectId: string;
    type: string;
    sourceElementId: string;
    sourceLayer: string;
    targetElementId: string;
    targetLayer: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  }): TraceLink {
    return new TraceLink(props.id, {
      projectId: props.projectId,
      type: TraceLinkType.from(props.type),
      sourceElementId: props.sourceElementId,
      sourceLayer: Layer.from(props.sourceLayer),
      targetElementId: props.targetElementId,
      targetLayer: Layer.from(props.targetLayer),
      description: props.description,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  get projectId(): string {
    return this._projectId;
  }
  get type(): TraceLinkType {
    return this._type;
  }
  get sourceElementId(): string {
    return this._sourceElementId;
  }
  get sourceLayer(): Layer {
    return this._sourceLayer;
  }
  get targetElementId(): string {
    return this._targetElementId;
  }
  get targetLayer(): Layer {
    return this._targetLayer;
  }
  get description(): string | undefined {
    return this._description;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateDescription(description?: string): void {
    this._description = description;
    this._updatedAt = new Date();
  }

  isAdjacentLayerTrace(): boolean {
    return Math.abs(this._sourceLayer.order - this._targetLayer.order) === 1;
  }

  isDownwardTrace(): boolean {
    return this._sourceLayer.order > this._targetLayer.order;
  }

  toJSON() {
    return {
      id: this._id,
      projectId: this._projectId,
      type: this._type.value,
      sourceElementId: this._sourceElementId,
      sourceLayer: this._sourceLayer.value,
      targetElementId: this._targetElementId,
      targetLayer: this._targetLayer.value,
      description: this._description,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
