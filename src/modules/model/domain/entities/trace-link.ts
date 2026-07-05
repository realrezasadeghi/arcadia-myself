import { Entity } from "@/modules/shared/domain/entity";
import type { SemanticTraceLink } from "../core/interfaces";
import { Layer } from "../value-objects/layer";
import { TraceLinkType } from "../value-objects/trace-link";

interface TraceLinkProps {
  projectId: string;
  sourceModelId: string;
  targetModelId: string;
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
 * TraceLink — Entity (fixed)
 * ARCADIA cross-layer links:
 *   SA realizes OA  → SystemFunction —[Realization]→ OperationalActivity
 *   LA realizes SA  → LogicalFunction —[Realization]→ SystemFunction
 *   PA realizes LA  → PhysicalComponent —[Realization]→ LogicalComponent
 *   LA Allocation   → LogicalFunction —[Allocation]→ LogicalComponent (same model)
 */
export class TraceLink extends Entity<string> implements SemanticTraceLink {
  private _description?: string;
  private readonly _projectId: string;
  private readonly _sourceModelId: string;
  private readonly _targetModelId: string;
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
    this._sourceModelId = props.sourceModelId;
    this._targetModelId = props.targetModelId;
    this._type = props.type;
    this._sourceElementId = props.sourceElementId;
    this._sourceLayer = props.sourceLayer;
    this._targetElementId = props.targetElementId;
    this._targetLayer = props.targetLayer;
    this._description = props.description;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    if (
      this._sourceElementId === this._targetElementId &&
      props.sourceLayer.equals(props.targetLayer)
    ) {
      throw new Error("An element cannot trace to itself");
    }
  }

  static create(props: {
    id: string;
    projectId: string;
    sourceModelId: string;
    targetModelId: string;
    type: string;
    sourceElementId: string;
    sourceLayer: string;
    targetElementId: string;
    targetLayer: string;
    description?: string;
  }): TraceLink {
    return new TraceLink(props.id, {
      projectId: props.projectId,
      sourceModelId: props.sourceModelId,
      targetModelId: props.targetModelId,
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
    sourceModelId: string;
    targetModelId: string;
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
      sourceModelId: props.sourceModelId,
      targetModelId: props.targetModelId,
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

  get sourceModelId(): string {
    return this._sourceModelId;
  }
  get targetModelId(): string {
    return this._targetModelId;
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
      sourceModelId: this._sourceModelId,
      targetModelId: this._targetModelId,
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
