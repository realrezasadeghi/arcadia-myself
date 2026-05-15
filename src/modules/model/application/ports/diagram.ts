import type {
  Diagram,
  ElementLayout,
  Viewport,
} from "../../domain/entities/diagram";
import type { DiagramType } from "../../domain/value-objects/diagram-type";

export type FindByModelIdQuery = {
  modelId: string;
};

export type FindByIdQuery = {
  id: string;
};

export type CreateDiagramPayload = {
  modelId: string;
  type: DiagramType;
  name: string;
  description?: string;
};

export type UpdateDiagramPayload = {
  id: string;
  name: string;
  description?: string;
};

export type UpdateDiagramLayoutPayload = {
  id: string;
  viewport?: Viewport;
  elementLayouts?: ElementLayout[];
};

export type RemoveDiagramPayload = {
  id: string;
};

export interface IDiagramRepository {
  findByModelId(query: FindByModelIdQuery): Promise<Diagram[]>;
  findById(query: FindByIdQuery): Promise<Diagram | null>;
  create(payload: CreateDiagramPayload): Promise<Diagram>;
  update(payload: UpdateDiagramPayload): Promise<Diagram>;
  updateLayout(payload: UpdateDiagramLayoutPayload): Promise<Diagram>;
  remove(payload: RemoveDiagramPayload): Promise<boolean>;
}
