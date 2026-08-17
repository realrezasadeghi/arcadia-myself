import { Entity } from "@/modules/shared/domain/entity";
import { LifelineType } from "../value-objects/lifeline-type";

interface LifelineProps {
  scenarioId: string;
  name: string;
  representedElementType: LifelineType;
  representedElementId: string | null;
  representedElementExternalId: string | null;
  columnIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Lifeline — Entity
 *
 * A vertical participant in a sequence diagram.
 * Represents an actor, function, component, or class element
 * that participates in the scenario interaction.
 */
export class Lifeline extends Entity<string> {
  private _name: string;
  private readonly _scenarioId: string;
  private readonly _representedElementType: LifelineType;
  private _representedElementId: string | null;
  private _representedElementExternalId: string | null;
  private _columnIndex: number;
  private _updatedAt: Date;
  readonly createdAt: Date;

  private constructor(id: string, props: LifelineProps) {
    super(id);
    this._scenarioId = props.scenarioId;
    this._name = props.name;
    this._representedElementType = props.representedElementType;
    this._representedElementId = props.representedElementId;
    this._representedElementExternalId = props.representedElementExternalId;
    this._columnIndex = props.columnIndex;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id: string;
    scenarioId: string;
    name: string;
    representedElementType: string;
    representedElementId?: string;
    representedElementExternalId?: string;
    columnIndex: number;
  }): Lifeline {
    if (!props.name.trim()) throw new Error("Lifeline name is required");

    return new Lifeline(props.id, {
      scenarioId: props.scenarioId,
      name: props.name.trim(),
      representedElementType: LifelineType.from(props.representedElementType),
      representedElementId: props.representedElementId ?? null,
      representedElementExternalId: props.representedElementExternalId ?? null,
      columnIndex: props.columnIndex,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: {
    id: string;
    scenarioId: string;
    name: string;
    representedElementType: string;
    representedElementId: string | null;
    representedElementExternalId: string | null;
    columnIndex: number;
    createdAt: string;
    updatedAt: string;
  }): Lifeline {
    return new Lifeline(props.id, {
      scenarioId: props.scenarioId,
      name: props.name,
      representedElementType: LifelineType.from(props.representedElementType),
      representedElementId: props.representedElementId,
      representedElementExternalId: props.representedElementExternalId,
      columnIndex: props.columnIndex,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  get scenarioId(): string {
    return this._scenarioId;
  }

  get name(): string {
    return this._name;
  }

  get representedElementType(): LifelineType {
    return this._representedElementType;
  }

  get representedElementId(): string | null {
    return this._representedElementId;
  }

  get representedElementExternalId(): string | null {
    return this._representedElementExternalId;
  }

  get columnIndex(): number {
    return this._columnIndex;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  rename(name: string): void {
    if (!name.trim()) throw new Error("Lifeline name cannot be empty");
    this._name = name.trim();
    this._touch();
  }

  setColumnIndex(index: number): void {
    if (index < 0) throw new Error("Column index must be non-negative");
    this._columnIndex = index;
    this._touch();
  }

  linkToElement(elementId: string): void {
    this._representedElementId = elementId;
    this._touch();
  }

  unlinkElement(): void {
    this._representedElementId = null;
    this._touch();
  }

  toJSON() {
    return {
      id: this._id,
      scenarioId: this._scenarioId,
      name: this._name,
      representedElementType: this._representedElementType.value,
      representedElementId: this._representedElementId,
      representedElementExternalId: this._representedElementExternalId,
      columnIndex: this._columnIndex,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }
}
