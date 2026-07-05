import type {
  ElementLayout,
  Viewport,
} from "../../domain/value-objects/diagram-layout";

export type FindLayoutByDiagramIdQuery = {
  diagramId: string;
};

export type FindLayoutsByDiagramIdsQuery = {
  diagramIds: string[];
};

export type FindLayoutsContainingElementQuery = {
  elementId: string;
};

export type CreateLayoutPayload = {
  diagramId: string;
};

export type UpdateLayoutPayload = {
  diagramId: string;
  viewport?: Viewport;
  elementPositions?: ElementLayout[];
};

export type RemoveLayoutPayload = {
  diagramId: string;
};

export interface IDiagramLayoutRepository {
  findByDiagramId(query: FindLayoutByDiagramIdQuery): Promise<{
    diagramId: string;
    viewport: Viewport;
    elementLayouts: ElementLayout[];
  } | null>;
  findByDiagramIds(
    query: FindLayoutsByDiagramIdsQuery,
  ): Promise<
    Map<string, { viewport: Viewport; elementLayouts: ElementLayout[] }>
  >;
  findDiagramIdsContainingElement(
    query: FindLayoutsContainingElementQuery,
  ): Promise<string[]>;
  create(payload: CreateLayoutPayload): Promise<void>;
  update(payload: UpdateLayoutPayload): Promise<void>;
  remove(payload: RemoveLayoutPayload): Promise<void>;
}
