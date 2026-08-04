import { Entity } from "@/modules/shared/domain/entity";

interface ClassRelationshipLayoutProps {
  classDiagramId: string;
  classRelationshipId: string;
  labelX: number | null;
  labelY: number | null;
  sourceRoleLabelX: number | null;
  sourceRoleLabelY: number | null;
  targetRoleLabelX: number | null;
  targetRoleLabelY: number | null;
  sourceMultLabelX: number | null;
  sourceMultLabelY: number | null;
  targetMultLabelX: number | null;
  targetMultLabelY: number | null;
  waypoints: Array<{ x: number; y: number }>;
  createdAt: Date;
  updatedAt: Date;
}

export class ClassRelationshipLayout extends Entity<string> {
  private readonly _classDiagramId: string;
  private readonly _classRelationshipId: string;
  private _labelX: number | null;
  private _labelY: number | null;
  private _sourceRoleLabelX: number | null;
  private _sourceRoleLabelY: number | null;
  private _targetRoleLabelX: number | null;
  private _targetRoleLabelY: number | null;
  private _sourceMultLabelX: number | null;
  private _sourceMultLabelY: number | null;
  private _targetMultLabelX: number | null;
  private _targetMultLabelY: number | null;
  private _waypoints: Array<{ x: number; y: number }>;
  private _updatedAt: Date;
  readonly createdAt: Date;

  private constructor(id: string, props: ClassRelationshipLayoutProps) {
    super(id);
    this._classDiagramId = props.classDiagramId;
    this._classRelationshipId = props.classRelationshipId;
    this._labelX = props.labelX;
    this._labelY = props.labelY;
    this._sourceRoleLabelX = props.sourceRoleLabelX;
    this._sourceRoleLabelY = props.sourceRoleLabelY;
    this._targetRoleLabelX = props.targetRoleLabelX;
    this._targetRoleLabelY = props.targetRoleLabelY;
    this._sourceMultLabelX = props.sourceMultLabelX;
    this._sourceMultLabelY = props.sourceMultLabelY;
    this._targetMultLabelX = props.targetMultLabelX;
    this._targetMultLabelY = props.targetMultLabelY;
    this._waypoints = props.waypoints;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id: string;
    classDiagramId: string;
    classRelationshipId: string;
    labelX?: number | null;
    labelY?: number | null;
    sourceRoleLabelX?: number | null;
    sourceRoleLabelY?: number | null;
    targetRoleLabelX?: number | null;
    targetRoleLabelY?: number | null;
    sourceMultLabelX?: number | null;
    sourceMultLabelY?: number | null;
    targetMultLabelX?: number | null;
    targetMultLabelY?: number | null;
    waypoints?: Array<{ x: number; y: number }>;
  }): ClassRelationshipLayout {
    return new ClassRelationshipLayout(props.id, {
      classDiagramId: props.classDiagramId,
      classRelationshipId: props.classRelationshipId,
      labelX: props.labelX ?? null,
      labelY: props.labelY ?? null,
      sourceRoleLabelX: props.sourceRoleLabelX ?? null,
      sourceRoleLabelY: props.sourceRoleLabelY ?? null,
      targetRoleLabelX: props.targetRoleLabelX ?? null,
      targetRoleLabelY: props.targetRoleLabelY ?? null,
      sourceMultLabelX: props.sourceMultLabelX ?? null,
      sourceMultLabelY: props.sourceMultLabelY ?? null,
      targetMultLabelX: props.targetMultLabelX ?? null,
      targetMultLabelY: props.targetMultLabelY ?? null,
      waypoints: props.waypoints ?? [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: {
    id: string;
    classDiagramId: string;
    classRelationshipId: string;
    labelX: number | null;
    labelY: number | null;
    sourceRoleLabelX: number | null;
    sourceRoleLabelY: number | null;
    targetRoleLabelX: number | null;
    targetRoleLabelY: number | null;
    sourceMultLabelX: number | null;
    sourceMultLabelY: number | null;
    targetMultLabelX: number | null;
    targetMultLabelY: number | null;
    waypoints: Array<{ x: number; y: number }>;
    createdAt: string;
    updatedAt: string;
  }): ClassRelationshipLayout {
    return new ClassRelationshipLayout(props.id, {
      classDiagramId: props.classDiagramId,
      classRelationshipId: props.classRelationshipId,
      labelX: props.labelX,
      labelY: props.labelY,
      sourceRoleLabelX: props.sourceRoleLabelX,
      sourceRoleLabelY: props.sourceRoleLabelY,
      targetRoleLabelX: props.targetRoleLabelX,
      targetRoleLabelY: props.targetRoleLabelY,
      sourceMultLabelX: props.sourceMultLabelX,
      sourceMultLabelY: props.sourceMultLabelY,
      targetMultLabelX: props.targetMultLabelX,
      targetMultLabelY: props.targetMultLabelY,
      waypoints: props.waypoints,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  get classDiagramId(): string {
    return this._classDiagramId;
  }
  get classRelationshipId(): string {
    return this._classRelationshipId;
  }
  get labelX(): number | null {
    return this._labelX;
  }
  get labelY(): number | null {
    return this._labelY;
  }
  get sourceRoleLabelX(): number | null {
    return this._sourceRoleLabelX;
  }
  get sourceRoleLabelY(): number | null {
    return this._sourceRoleLabelY;
  }
  get targetRoleLabelX(): number | null {
    return this._targetRoleLabelX;
  }
  get targetRoleLabelY(): number | null {
    return this._targetRoleLabelY;
  }
  get sourceMultLabelX(): number | null {
    return this._sourceMultLabelX;
  }
  get sourceMultLabelY(): number | null {
    return this._sourceMultLabelY;
  }
  get targetMultLabelX(): number | null {
    return this._targetMultLabelX;
  }
  get targetMultLabelY(): number | null {
    return this._targetMultLabelY;
  }
  get waypoints(): ReadonlyArray<{ x: number; y: number }> {
    return this._waypoints;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  setLabelPosition(labelX: number | null, labelY: number | null): void {
    this._labelX = labelX;
    this._labelY = labelY;
    this._touch();
  }

  setSourceRoleLabelPosition(
    labelX: number | null,
    labelY: number | null,
  ): void {
    this._sourceRoleLabelX = labelX;
    this._sourceRoleLabelY = labelY;
    this._touch();
  }

  setTargetRoleLabelPosition(
    labelX: number | null,
    labelY: number | null,
  ): void {
    this._targetRoleLabelX = labelX;
    this._targetRoleLabelY = labelY;
    this._touch();
  }

  setSourceMultiplicityLabelPosition(
    labelX: number | null,
    labelY: number | null,
  ): void {
    this._sourceMultLabelX = labelX;
    this._sourceMultLabelY = labelY;
    this._touch();
  }

  setTargetMultiplicityLabelPosition(
    labelX: number | null,
    labelY: number | null,
  ): void {
    this._targetMultLabelX = labelX;
    this._targetMultLabelY = labelY;
    this._touch();
  }

  setWaypoints(waypoints: Array<{ x: number; y: number }>): void {
    this._waypoints = waypoints;
    this._touch();
  }

  toJSON() {
    return {
      id: this._id,
      classDiagramId: this._classDiagramId,
      classRelationshipId: this._classRelationshipId,
      labelX: this._labelX,
      labelY: this._labelY,
      sourceRoleLabelX: this._sourceRoleLabelX,
      sourceRoleLabelY: this._sourceRoleLabelY,
      targetRoleLabelX: this._targetRoleLabelX,
      targetRoleLabelY: this._targetRoleLabelY,
      sourceMultLabelX: this._sourceMultLabelX,
      sourceMultLabelY: this._sourceMultLabelY,
      targetMultLabelX: this._targetMultLabelX,
      targetMultLabelY: this._targetMultLabelY,
      waypoints: this._waypoints,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }
}
