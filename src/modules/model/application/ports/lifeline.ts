import type { Lifeline } from "../../domain/entities/lifeline";
import type { LifelineType } from "../../domain/value-objects/lifeline-type";

export type FindLifelineByIdQuery = {
  id: string;
};

export type FindLifelinesByScenarioIdQuery = {
  scenarioId: string;
};

export type CreateLifelinePayload = {
  scenarioId: string;
  name: string;
  representedElementType: LifelineType;
  representedElementId?: string;
  representedElementExternalId?: string;
  columnIndex: number;
};

export type UpdateLifelinePayload = {
  id: string;
  name: string;
};

export type ReorderLifelinesPayload = {
  scenarioId: string;
  lifelineIds: string[];
};

export type RemoveLifelinePayload = {
  id: string;
};

export interface ILifelineRepository {
  findById(query: FindLifelineByIdQuery): Promise<Lifeline | null>;
  findByScenarioId(query: FindLifelinesByScenarioIdQuery): Promise<Lifeline[]>;
  create(payload: CreateLifelinePayload): Promise<Lifeline>;
  update(payload: UpdateLifelinePayload): Promise<Lifeline>;
  reorder(payload: ReorderLifelinesPayload): Promise<void>;
  remove(payload: RemoveLifelinePayload): Promise<boolean>;
}
