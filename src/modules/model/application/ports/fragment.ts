import type { Fragment } from "../../domain/entities/fragment";
import type { FragmentOperator } from "../../domain/value-objects/fragment-operator";

export type FindFragmentByIdQuery = {
  id: string;
};

export type FindFragmentsByScenarioIdQuery = {
  scenarioId: string;
};

export type CreateFragmentPayload = {
  scenarioId: string;
  name: string;
  operator: FragmentOperator;
  guard?: string;
  rowIndex: number;
  columnIndex: number;
  spanColumns?: number;
};

export type UpdateFragmentPayload = {
  id: string;
  name: string;
  guard?: string;
};

export type UpdateFragmentPositionPayload = {
  id: string;
  rowIndex: number;
  columnIndex: number;
  spanColumns?: number;
};

export type RemoveFragmentPayload = {
  id: string;
};

export interface IFragmentRepository {
  findById(query: FindFragmentByIdQuery): Promise<Fragment | null>;
  findByScenarioId(query: FindFragmentsByScenarioIdQuery): Promise<Fragment[]>;
  create(payload: CreateFragmentPayload): Promise<Fragment>;
  update(payload: UpdateFragmentPayload): Promise<Fragment>;
  updatePosition(payload: UpdateFragmentPositionPayload): Promise<Fragment>;
  remove(payload: RemoveFragmentPayload): Promise<boolean>;
}
