import { Entity } from "@/modules/shared/domain/entity";

interface FragmentOperandProps {
  fragmentId: string;
  position: number;
  guard: string;
  createdAt: Date;
  updatedAt: Date;
}

export class FragmentOperand extends Entity<string> {
  private _fragmentId: string;
  private _position: number;
  private _guard: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: string, props: FragmentOperandProps) {
    super(id);
    this._fragmentId = props.fragmentId;
    this._position = props.position;
    this._guard = props.guard;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id: string;
    fragmentId: string;
    position: number;
    guard?: string;
  }): FragmentOperand {
    return new FragmentOperand(props.id, {
      fragmentId: props.fragmentId,
      position: props.position,
      guard: props.guard ?? "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: {
    id: string;
    fragmentId: string;
    position: number;
    guard: string;
    createdAt: string;
    updatedAt: string;
  }): FragmentOperand {
    return new FragmentOperand(props.id, {
      fragmentId: props.fragmentId,
      position: props.position,
      guard: props.guard,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  get fragmentId(): string {
    return this._fragmentId;
  }

  get position(): number {
    return this._position;
  }

  get guard(): string {
    return this._guard;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updatePosition(position: number): void {
    this._position = position;
    this._touch();
  }

  updateGuard(guard: string): void {
    this._guard = guard;
    this._touch();
  }

  toJSON() {
    return {
      id: this._id,
      fragmentId: this._fragmentId,
      position: this._position,
      guard: this._guard,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }
}
