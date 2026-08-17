import { Entity } from "@/modules/shared/domain/entity";
import { ScenarioType } from "../value-objects/scenario-type";

interface ScenarioProps {
  modelId: string;
  name: string;
  description: string;
  scenarioType: ScenarioType;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Scenario — Entity
 *
 * A sequence diagram representing behavioral interactions between elements.
 * Each ARCADIA layer has its own scenario type (OIS, SS, LS, PS).
 * Contains lifelines and messages that model the interaction flow.
 */
export class Scenario extends Entity<string> {
  private _name: string;
  private _description: string;
  private readonly _modelId: string;
  private readonly _scenarioType: ScenarioType;
  private _status: string;
  private _updatedAt: Date;
  readonly createdAt: Date;

  private constructor(id: string, props: ScenarioProps) {
    super(id);
    this._modelId = props.modelId;
    this._name = props.name;
    this._description = props.description;
    this._scenarioType = props.scenarioType;
    this._status = props.status;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id: string;
    modelId: string;
    name: string;
    description?: string;
    scenarioType: string;
  }): Scenario {
    if (!props.name.trim()) throw new Error("Scenario name is required");

    return new Scenario(props.id, {
      modelId: props.modelId,
      name: props.name.trim(),
      description: props.description ?? "",
      scenarioType: ScenarioType.from(props.scenarioType),
      status: "DRAFT",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: {
    id: string;
    modelId: string;
    name: string;
    description: string;
    scenarioType: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }): Scenario {
    return new Scenario(props.id, {
      modelId: props.modelId,
      name: props.name,
      description: props.description,
      scenarioType: ScenarioType.from(props.scenarioType),
      status: props.status,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  get modelId(): string {
    return this._modelId;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get scenarioType(): ScenarioType {
    return this._scenarioType;
  }

  get status(): string {
    return this._status;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  rename(name: string): void {
    if (!name.trim()) throw new Error("Scenario name cannot be empty");
    this._name = name.trim();
    this._touch();
  }

  updateDescription(description: string): void {
    this._description = description;
    this._touch();
  }

  validate(): void {
    if (this._status === "DEPRECATED")
      throw new Error("Cannot validate a deprecated scenario");
    this._status = "VALIDATED";
    this._touch();
  }

  deprecate(): void {
    this._status = "DEPRECATED";
    this._touch();
  }

  revertToDraft(): void {
    this._status = "DRAFT";
    this._touch();
  }

  toJSON() {
    return {
      id: this._id,
      modelId: this._modelId,
      name: this._name,
      description: this._description,
      scenarioType: this._scenarioType.value,
      status: this._status,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }
}
