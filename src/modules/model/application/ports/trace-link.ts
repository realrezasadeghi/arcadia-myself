import type { TraceLink } from "../../domain/entities/trace-link";
import type { Layer } from "../../domain/value-objects/layer";
import type { TraceLinkType } from "../../domain/value-objects/trace-link";

export type FindByProjectIdQuery = {
  projectId: string;
};

export type FindByElementIdQuery = {
  elementId: string;
};

export type FindByIdQuery = {
  id: string;
};

export type CreateTraceLinkPayload = {
  projectId: string;
  type: TraceLinkType;
  sourceElementId: string;
  sourceLayer: Layer;
  targetElementId: string;
  targetLayer: Layer;
  description?: string;
};

export type UpdateTraceLinkPayload = {
  id: string;
  description?: string;
};

export type RemoveTraceLinkPayload = {
  id: string;
};

export interface ITraceLinkRepository {
  findByProjectId(query: FindByProjectIdQuery): Promise<TraceLink[]>;
  findByElementId(query: FindByElementIdQuery): Promise<TraceLink[]>;
  findById(query: FindByIdQuery): Promise<TraceLink | null>;
  create(payload: CreateTraceLinkPayload): Promise<TraceLink>;
  update(payload: UpdateTraceLinkPayload): Promise<TraceLink>;
  remove(payload: RemoveTraceLinkPayload): Promise<boolean>;
}
