import { Entity } from "@/modules/shared/domain/entity";
import { DomainError } from "@/modules/shared/domain/error";
import { Username } from "../value-objects/username";

export interface UserProps {
  id: number;
  name: string;
  username: Username;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends Entity<number> {
  private _name: string;
  private _username: Username;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(id: number, props: UserProps) {
    super(id);
    this._name = props.name;
    this._username = props.username;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: { id: number; name: string; username: string }): User {
    if (!props.name.trim()) throw new DomainError("User name is required");
    return new User(props.id, {
      id: props.id,
      name: props.name.trim(),
      username: Username.create(props.username),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: {
    id: number;
    name: string;
    username: string;
    createdAt: string;
    updatedAt: string;
  }): User {
    return new User(props.id, {
      id: props.id,
      name: props.name,
      username: Username.create(props.username),
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  get username(): Username {
    return this._username;
  }

  get name(): string {
    return this._name;
  }

  changeName(name: string): void {
    if (!name.trim()) throw new DomainError("User name cannot be empty");
    this._name = name.trim();
  }

  get initials(): string {
    return this._name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  toJSON() {
    return {
      id: this._id, // number
      name: this._name,
      username: this._username.value,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
