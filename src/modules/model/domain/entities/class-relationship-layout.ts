import { Entity } from "@/modules/shared/domain/entity";

interface ClassRelationshipLayoutProps {
  classDiagramId: string;
  classRelationshipId: string;
  labelX: number | null;
  labelY: number | null;
  waypoints: Array<{ x: number; y: number }>;
  createdAt: Date;
  updatedAt: Date;
}

export class ClassRelationshipLayout extends Entity<string> {
  private readonly _classDiagramId: string;
  private readonly _classRelationshipId: string;
  private _labelX: number | null;
  private _labelY: number | null;
  private _waypoints: Array<{ x: number; y: number }>;
  private _updatedAt: Date;
  readonly createdAt: Date;

  private constructor(id: string, props: ClassRelationshipLayoutProps) {
    super(id);
    this._classDiagramId = props.classDiagramId;
    this._classRelationshipId = props.classRelationshipId;
    this._labelX = props.labelX;
    this._labelY = props.labelY;
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
    waypoints?: Array<{ x: number; y: number }>;
  }): ClassRelationshipLayout {
    return new ClassRelationshipLayout(props.id, {
      classDiagramId: props.classDiagramId,
      classRelationshipId: props.classRelationshipId,
      labelX: props.labelX ?? null,
      labelY: props.labelY ?? null,
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
    waypoints: Array<{ x: number; y: number }>;
    createdAt: string;
    updatedAt: string;
  }): ClassRelationshipLayout {
    return new ClassRelationshipLayout(props.id, {
      classDiagramId: props.classDiagramId,
      classRelationshipId: props.classRelationshipId,
      labelX: props.labelX,
      labelY: props.labelY,
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
      waypoints: this._waypoints,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }
}