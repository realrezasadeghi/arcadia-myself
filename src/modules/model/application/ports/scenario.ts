import type { ScenarioDiagram } from "@/modules/model/domain/entities/scenario-diagram";
import type { ScenarioFragment } from "@/modules/model/domain/entities/scenario-fragment";
import type { ScenarioLifeline } from "@/modules/model/domain/entities/scenario-lifeline";
import type { ScenarioMessage } from "@/modules/model/domain/entities/scenario-message";
import type { LifelineType } from "@/modules/model/domain/value-objects/lifeline-type";
import type { MessageSort } from "@/modules/model/domain/value-objects/message-sort";
import type { FragmentType } from "@/modules/model/domain/value-objects/fragment-type";

export type CreateScenarioDiagramPayload = {
  modelId: string;
  type: string;
  name: string;
  description?: string;
};

export type CreateScenarioLifelinePayload = {
  diagramId: string;
  elementId: string;
  type: LifelineType;
  selector?: string;
  decomposed?: boolean;
};

export type CreateScenarioMessagePayload = {
  diagramId: string;
  sourceLifelineId: string;
  targetLifelineId: string;
  sort: MessageSort;
  name: string;
  signature?: string;
  arguments?: string;
  fragmentId?: string | null;
  sequenceOrder: number;
};

export type CreateScenarioFragmentPayload = {
  diagramId: string;
  type: FragmentType;
  guard?: string;
  parentFragmentId?: string | null;
  minSequenceOrder: number;
  maxSequenceOrder: number;
};

export interface ScenarioDiagramRepository {
  findById(id: string): Promise<ScenarioDiagram | null>;
  findByModelId(modelId: string): Promise<ScenarioDiagram[]>;
  create(payload: CreateScenarioDiagramPayload): Promise<ScenarioDiagram>;
  save(diagram: ScenarioDiagram): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface ScenarioLifelineRepository {
  findById(id: string): Promise<ScenarioLifeline | null>;
  findByDiagramId(diagramId: string): Promise<ScenarioLifeline[]>;
  findByElementId(elementId: string): Promise<ScenarioLifeline[]>;
  create(payload: CreateScenarioLifelinePayload): Promise<ScenarioLifeline>;
  save(lifeline: ScenarioLifeline): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface ScenarioMessageRepository {
  findById(id: string): Promise<ScenarioMessage | null>;
  findByDiagramId(diagramId: string): Promise<ScenarioMessage[]>;
  findByLifelineId(lifelineId: string): Promise<ScenarioMessage[]>;
  findByFragmentId(fragmentId: string): Promise<ScenarioMessage[]>;
  create(payload: CreateScenarioMessagePayload): Promise<ScenarioMessage>;
  save(message: ScenarioMessage): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface ScenarioFragmentRepository {
  findById(id: string): Promise<ScenarioFragment | null>;
  findByDiagramId(diagramId: string): Promise<ScenarioFragment[]>;
  findByParentId(parentFragmentId: string): Promise<ScenarioFragment[]>;
  create(payload: CreateScenarioFragmentPayload): Promise<ScenarioFragment>;
  save(fragment: ScenarioFragment): Promise<void>;
  delete(id: string): Promise<void>;
}