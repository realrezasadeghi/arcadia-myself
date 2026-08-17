import type { Scenario } from "../../domain/entities/scenario";
import type { ScenarioType } from "../../domain/value-objects/scenario-type";

export type FindScenarioByIdQuery = {
  id: string;
};

export type FindScenariosByModelIdQuery = {
  modelId: string;
};

export type CreateScenarioPayload = {
  modelId: string;
  name: string;
  description?: string;
  scenarioType: ScenarioType;
};

export type UpdateScenarioPayload = {
  id: string;
  name: string;
  description?: string;
};

export type RemoveScenarioPayload = {
  id: string;
};

export interface IScenarioRepository {
  findById(query: FindScenarioByIdQuery): Promise<Scenario | null>;
  findByModelId(query: FindScenariosByModelIdQuery): Promise<Scenario[]>;
  create(payload: CreateScenarioPayload): Promise<Scenario>;
  update(payload: UpdateScenarioPayload): Promise<Scenario>;
  remove(payload: RemoveScenarioPayload): Promise<boolean>;
}
