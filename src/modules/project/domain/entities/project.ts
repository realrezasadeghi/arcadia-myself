import { AggregateRoot } from "@/modules/shared/domain/aggregate-root";
import { ProjectName } from "../value-objects/project-name";

export type ProjectRole = "OWNER" | "EDITOR" | "VIEWER";

export type ProjectMember = {
  userId: number;
  role: ProjectRole;
  joinedAt: Date;
};

export type ProjectProps = {
  name: ProjectName;
  description?: string;
  ownerId: number;
  members: Map<string, ProjectMember>;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Project — Aggregate Root
 *
 * کنترل کامل عضوگیری، دسترسی و تغییر نام پروژه.
 * تنها نقطه ورودی برای تغییر state پروژه.
 */
export class Project extends AggregateRoot<number> {
  private _name: ProjectName;
  private _description?: string;
  private readonly _ownerId: number;
  private readonly _members: Map<string, ProjectMember>;
  private _updatedAt: Date;
  readonly _createdAt: Date;

  private constructor(id: number, props: ProjectProps) {
    super(id);
    this._name = props.name;
    this._description = props.description;
    this._ownerId = props.ownerId;
    this._members = props.members;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  /** Factory: ساخت پروژه جدید */
  static create(props: {
    id: number;
    name: string;
    description: string;
    ownerId: number;
  }): Project {
    const name = ProjectName.create(props.name);
    const now = new Date();
    const members = new Map<string, ProjectMember>();

    members.set(props.ownerId.toString(), {
      userId: props.ownerId,
      role: "OWNER",
      joinedAt: now,
    });

    return new Project(props.id, {
      name,
      description: props.description,
      ownerId: props.ownerId,
      members,
      createdAt: now,
      updatedAt: now,
    });
  }

  /** Factory: بازسازی از داده‌های ذخیره‌شده (از API) */
  static reconstitute(props: {
    id: number;
    name: string;
    description?: string;
    ownerId: number;
    members: Array<ProjectMember>;
    createdAt: string;
    updatedAt: string;
  }): Project {
    const members = new Map<string, ProjectMember>();
    for (const m of props.members) {
      members.set(m.userId.toString(), {
        userId: m.userId,
        role: m.role,
        joinedAt: new Date(m.joinedAt),
      });
    }
    return new Project(props.id, {
      name: ProjectName.create(props.name),
      description: props.description,
      ownerId: props.ownerId,
      members,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  // ─── Getters ───────────────────────────────────────────────────────────────
  get name(): ProjectName {
    return this._name;
  }
  get description(): string | undefined {
    return this._description;
  }
  get ownerId(): number {
    return this._ownerId;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  get members(): ReadonlyArray<ProjectMember> {
    return Array.from(this._members.values());
  }

  // ─── Business Methods ──────────────────────────────────────────────────────

  rename(newName: string): void {
    this._name = ProjectName.create(newName);
    this._touch();
  }

  updateDescription(description: string): void {
    this._description = description;
    this._touch();
  }

  addMember(userId: number, role: Exclude<ProjectRole, "OWNER">): void {
    if (this._members.has(userId.toString())) {
      throw new Error("این کاربر قبلاً عضو پروژه است");
    }
    this._members.set(userId.toString(), {
      userId,
      role,
      joinedAt: new Date(),
    });
    this._touch();
  }

  changeMemberRole(
    userId: number,
    newRole: Exclude<ProjectRole, "OWNER">,
  ): void {
    if (userId === this._ownerId) {
      throw new Error("نقش مالک پروژه قابل تغییر نیست");
    }
    const member = this._members.get(userId.toString());
    if (!member) throw new Error("کاربر عضو این پروژه نیست");
    member.role = newRole;
    this._touch();
  }

  removeMember(userId: number): void {
    if (userId === this._ownerId) {
      throw new Error("مالک پروژه نمی‌تواند حذف شود");
    }
    if (!this._members.has(userId.toString())) {
      throw new Error("کاربر عضو این پروژه نیست");
    }
    this._members.delete(userId.toString());
    this._touch();
  }

  // ─── Access Control ────────────────────────────────────────────────────────

  canEdit(userId: string): boolean {
    const member = this._members.get(userId);
    return member?.role === "OWNER" || member?.role === "EDITOR";
  }

  canView(userId: string): boolean {
    return this._members.has(userId);
  }

  isOwner(userId: number): boolean {
    return this._ownerId === userId;
  }

  getMemberRole(userId: string): ProjectRole | null {
    return this._members.get(userId)?.role ?? null;
  }

  // ─── Serialization ─────────────────────────────────────────────────────────

  toJSON() {
    return {
      id: this._id,
      name: this._name.value,
      description: this._description,
      ownerId: this._ownerId,
      members: Array.from(this._members.values()).map((member) => ({
        userId: member.userId,
        role: member.role,
        joinedAt: member.joinedAt.toISOString(),
      })),
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }
}
