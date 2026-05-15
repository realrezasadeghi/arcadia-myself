import type { Model } from "../../domain/entities/model";
import type { Layer } from "../../domain/value-objects/layer";

export type CreateModelPayload = {
  projectId: string;
  layer: Layer;
  name: string;
  description?: string;
};

export type UpdateModelPayload = {
  id: string;
  projectId: string;
  layer: Layer;
  name: string;
  description?: string;
};

export type RemoveModelPayload = {
  id: string;
};

export interface IModelRepository {
  findModelById(id: string): Promise<Model | null>;
  findModelsByProjectId(projectId: string): Promise<Model[]>;
  findModelByProjectIdAndLayer(
    projectId: string,
    layer: Layer,
  ): Promise<Model | null>;
  createModel(payload: CreateModelPayload): Promise<Model>;
  updateModel(payload: UpdateModelPayload): Promise<Model>;
  deleteModel(payload: RemoveModelPayload): Promise<boolean>;
}
