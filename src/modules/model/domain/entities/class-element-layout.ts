import { Entity } from "@/modules/shared/domain/entity";

interface ClassElementLayoutProps {
  classDiagramId: string;
  classElementId: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ClassElementLayout extends Entity<string> {
  private readonly _classDiagramId: string;
  private readonly _classElementId: string;
  private _description: string;
  private _x: number;
  private _y: number;
  private _width: number;
  private _height: number;
  private _updatedAt: Date;
  readonly createdAt: Date;

  private constructor(id: string, props: ClassElementLayoutProps) {
    super(id);
    this._classDiagramId = props.classDiagramId;
    this._classElementId = props.classElementId;
    this._description = props.description;
    this._x = props.x;
    this._y = props.y;
    this._width = props.width;
    this._height = props.height;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id: string;
    classDiagramId: string;
    classElementId: string;
    description?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }): ClassElementLayout {
    return new ClassElementLayout(props.id, {
      classDiagramId: props.classDiagramId,
      classElementId: props.classElementId,
      description: props.description ?? "",
      x: props.x ?? 0,
      y: props.y ?? 0,
      width: props.width ?? 160,
      height: props.height ?? 80,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: {
    id: string;
    classDiagramId: string;
    classElementId: string;
    description: string;
    x: number;
    y: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
  }): ClassElementLayout {
    return new ClassElementLayout(props.id, {
      classDiagramId: props.classDiagramId,
      classElementId: props.classElementId,
      description: props.description,
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  get classDiagramId(): string {
    return this._classDiagramId;
  }
  get classElementId(): string {
    return this._classElementId;
  }
  get description(): string {
    return this._description;
  }
  get x(): number {
    return this._x;
  }
  get y(): number {
    return this._y;
  }
  get width(): number {
    return this._width;
  }
  get height(): number {
    return this._height;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  setDescription(description: string): void {
    this._description = description;
    this._touch();
  }

  setPosition(x: number, y: number): void {
    this._x = x;
    this._y = y;
    this._touch();
  }

  setSize(width: number, height: number): void {
    this._width = width;
    this._height = height;
    this._touch();
  }

  toJSON() {
    return {
      id: this._id,
      classDiagramId: this._classDiagramId,
      classElementId: this._classElementId,
      description: this._description,
      x: this._x,
      y: this._y,
      width: this._width,
      height: this._height,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }
}