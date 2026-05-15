import type {
  ElementProperties,
  ModelElement,
} from "../../domain/entities/element";

export type FindElementsByModelIdQuery = {
  modelId: string;
};

export type FindElementsByIdQuery = {
  id: string;
};

export type CreateElementPayload = {
  modelId: string;
  type: string;
  name: string;
  description?: string;
  properties?: ElementProperties;
};

export type UpdateElementPayload = {
  id: string;
  name: string;
  description?: string;
  properties?: ElementProperties;
};

export type RemoveElementPayload = {
  id: string;
};

export interface IElementRepository {
  findElementsByModelId(
    query: FindElementsByModelIdQuery,
  ): Promise<ModelElement[]>;
  findElementById(query: FindElementsByIdQuery): Promise<ModelElement | null>;
  createElement(payload: CreateElementPayload): Promise<ModelElement>;
  updateElement(payload: UpdateElementPayload): Promise<ModelElement>;
  removeElement(payload: RemoveElementPayload): Promise<boolean>;
}
