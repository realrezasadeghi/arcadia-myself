import type {
  Relationship,
  RelationshipProperties,
} from "../../domain/entities/relationship";
import type { RelationshipType } from "../../domain/value-objects/relationship-type";

export type FindRelationshipsByModelIdQuery = {
  modelId: string;
};

export type CreateRelationshipPayload = {
  modelId: string;
  type: RelationshipType;
  sourceElementId: string;
  targetElementId: string;
  name?: string;
  description?: string;
};

export type UpdateRelationshipPayload = {
  id: string;
  modelId: string;
  name?: string;
  description?: string;
  properties?: RelationshipProperties;
};

export type RemoveRelationshipPayload = {
  id: string;
};

export interface IRelationshipRepository {
  findRelationshipsByModelId(
    query: FindRelationshipsByModelIdQuery,
  ): Promise<Relationship[]>;
  createRelationship(payload: CreateRelationshipPayload): Promise<Relationship>;
  updateRelationship(payload: UpdateRelationshipPayload): Promise<Relationship>;
  removeRelationship(payload: RemoveRelationshipPayload): Promise<boolean>;
}
