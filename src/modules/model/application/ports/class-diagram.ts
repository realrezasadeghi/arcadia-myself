import type { ClassDiagram } from "../../domain/entities/class-diagram";
import type { ClassElement } from "../../domain/entities/class-element";
import type { ClassRelationship } from "../../domain/entities/class-relationship";
import type { ClassProperty } from "../../domain/entities/class-property";
import type { ClassOperation } from "../../domain/entities/class-operation";
import type { ClassOperationParameter } from "../../domain/entities/class-operation-parameter";
import type { ClassEnumerationLiteral } from "../../domain/entities/class-enumeration-literal";
import type { ClassElementLayout } from "../../domain/entities/class-element-layout";
import type { ClassRelationshipLayout } from "../../domain/entities/class-relationship-layout";

// ─── Query Types ──────────────────────────────────────────────────────────────

export type FindClassDiagramsByModelIdQuery = {
  modelId: string;
};

export type FindClassDiagramByIdQuery = {
  id: string;
};

export type FindClassElementsByModelIdQuery = {
  modelId: string;
  layer?: string;
};

export type FindClassElementByIdQuery = {
  id: string;
};

export type FindClassRelationshipsByModelIdQuery = {
  modelId: string;
  layer?: string;
};

export type FindClassRelationshipByIdQuery = {
  id: string;
};

export type FindClassPropertiesByElementIdQuery = {
  classElementId: string;
};

export type FindClassPropertyByIdQuery = {
  id: string;
};

export type FindClassOperationsByElementIdQuery = {
  classElementId: string;
};

export type FindClassOperationByIdQuery = {
  id: string;
};

export type FindClassOperationParametersByOperationIdQuery = {
  classOperationId: string;
};

export type FindClassEnumerationLiteralsByElementIdQuery = {
  classElementId: string;
};

export type FindClassElementLayoutsByDiagramIdQuery = {
  classDiagramId: string;
};

export type FindClassRelationshipLayoutsByDiagramIdQuery = {
  classDiagramId: string;
};

// ─── Payload Types ────────────────────────────────────────────────────────────

export type CreateClassDiagramPayload = {
  modelId: string;
  layer: string;
  name: string;
  description?: string;
};

export type UpdateClassDiagramPayload = {
  id: string;
  name?: string;
  description?: string;
};

export type UpdateClassDiagramLayoutPayload = {
  id: string;
  viewport?: { x: number; y: number; zoom: number };
  elementLayouts?: Array<{
    elementId: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
  }>;
};

export type RemoveClassDiagramPayload = {
  id: string;
};

export type CreateClassElementPayload = {
  modelId: string;
  layer: string;
  name: string;
  description?: string;
  elementType: string;
  visibility?: string;
  isAbstract?: boolean;
  isStatic?: boolean;
  parentId?: string | null;
  ordering?: number;
  extensionProperties?: Record<string, unknown>;
};

export type UpdateClassElementPayload = {
  id: string;
  name?: string;
  description?: string;
  status?: "DRAFT" | "VALIDATED" | "DEPRECATED";
  elementType?: string;
  visibility?: string;
  isAbstract?: boolean;
  isStatic?: boolean;
  parentId?: string | null;
  ordering?: number;
  extensionProperties?: Record<string, unknown>;
};

export type RemoveClassElementPayload = {
  id: string;
};

export type CreateClassRelationshipPayload = {
  modelId: string;
  layer: string;
  sourceElementId: string;
  targetElementId: string;
  name?: string;
  description?: string;
  relationshipType: string;
  aggregationKind?: "NONE" | "SHARED" | "COMPOSITE";
  isDisjoint?: boolean;
  isComplete?: boolean;
  sourceMultiplicityLower?: number;
  sourceMultiplicityUpper?: string;
  targetMultiplicityLower?: number;
  targetMultiplicityUpper?: string;
  sourceRole?: string;
  targetRole?: string;
  isNavigableSource?: boolean;
  isNavigableTarget?: boolean;
  extensionProperties?: Record<string, unknown>;
};

export type UpdateClassRelationshipPayload = {
  id: string;
  name?: string;
  description?: string;
  relationshipType?: string;
  aggregationKind?: "NONE" | "SHARED" | "COMPOSITE";
  isDisjoint?: boolean;
  isComplete?: boolean;
  sourceMultiplicityLower?: number;
  sourceMultiplicityUpper?: string;
  targetMultiplicityLower?: number;
  targetMultiplicityUpper?: string;
  sourceRole?: string;
  targetRole?: string;
  isNavigableSource?: boolean;
  isNavigableTarget?: boolean;
  extensionProperties?: Record<string, unknown>;
};

export type RemoveClassRelationshipPayload = {
  id: string;
};

// Property payloads
export type CreateClassPropertyPayload = {
  classElementId: string;
  modelId: string;
  layer: string;
  name: string;
  description?: string;
  typeClassElementId?: string | null;
  typeLiteral?: string;
  isStatic?: boolean;
  isReadOnly?: boolean;
  isDerived?: boolean;
  visibility?: string;
  multiplicityLower?: number;
  multiplicityUpper?: string;
  isOrdered?: boolean;
  isUnique?: boolean;
  collectionKind?: string;
  aggregationKind?: "NONE" | "SHARED" | "COMPOSITE";
  defaultValue?: string;
  ordering?: number;
};

export type UpdateClassPropertyPayload = {
  id: string;
  name?: string;
  description?: string;
  typeClassElementId?: string | null;
  typeLiteral?: string;
  isStatic?: boolean;
  isReadOnly?: boolean;
  isDerived?: boolean;
  visibility?: string;
  multiplicityLower?: number;
  multiplicityUpper?: string;
  isOrdered?: boolean;
  isUnique?: boolean;
  collectionKind?: string;
  aggregationKind?: "NONE" | "SHARED" | "COMPOSITE";
  defaultValue?: string;
  ordering?: number;
};

export type RemoveClassPropertyPayload = {
  id: string;
};

// Operation payloads
export type CreateClassOperationPayload = {
  classElementId: string;
  modelId: string;
  layer: string;
  name: string;
  description?: string;
  returnTypeClassElementId?: string | null;
  returnTypeLiteral?: string;
  returnMultiplicityLower?: number;
  returnMultiplicityUpper?: string;
  isStatic?: boolean;
  isAbstract?: boolean;
  visibility?: string;
  ordering?: number;
};

export type UpdateClassOperationPayload = {
  id: string;
  name?: string;
  description?: string;
  returnTypeClassElementId?: string | null;
  returnTypeLiteral?: string;
  returnMultiplicityLower?: number;
  returnMultiplicityUpper?: string;
  isStatic?: boolean;
  isAbstract?: boolean;
  visibility?: string;
  ordering?: number;
};

export type RemoveClassOperationPayload = {
  id: string;
};

// Operation Parameter payloads
export type CreateClassOperationParameterPayload = {
  classOperationId: string;
  modelId: string;
  layer: string;
  name: string;
  typeClassElementId?: string | null;
  typeLiteral?: string;
  multiplicityLower?: number;
  multiplicityUpper?: string;
  defaultValue?: string;
  direction?: "IN" | "OUT" | "INOUT" | "RETURN";
  isOrdered?: boolean;
  isUnique?: boolean;
  ordering?: number;
};

export type UpdateClassOperationParameterPayload = {
  id: string;
  name?: string;
  typeClassElementId?: string | null;
  typeLiteral?: string;
  multiplicityLower?: number;
  multiplicityUpper?: string;
  defaultValue?: string;
  direction?: "IN" | "OUT" | "INOUT" | "RETURN";
  isOrdered?: boolean;
  isUnique?: boolean;
  ordering?: number;
};

export type RemoveClassOperationParameterPayload = {
  id: string;
};

// Enumeration Literal payloads
export type CreateClassEnumerationLiteralPayload = {
  classElementId: string;
  modelId: string;
  layer: string;
  name: string;
  value?: string;
  ordering?: number;
};

export type UpdateClassEnumerationLiteralPayload = {
  id: string;
  name?: string;
  value?: string;
  ordering?: number;
};

export type RemoveClassEnumerationLiteralPayload = {
  id: string;
};

// Layout payloads
export type CreateClassElementLayoutPayload = {
  classDiagramId: string;
  classElementId: string;
  description?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

export type UpdateClassElementLayoutPayload = {
  id: string;
  description?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

export type RemoveClassElementLayoutPayload = {
  id: string;
};

export type CreateClassRelationshipLayoutPayload = {
  classDiagramId: string;
  classRelationshipId: string;
  labelX?: number | null;
  labelY?: number | null;
  waypoints?: Array<{ x: number; y: number }>;
};

export type UpdateClassRelationshipLayoutPayload = {
  id: string;
  labelX?: number | null;
  labelY?: number | null;
  waypoints?: Array<{ x: number; y: number }>;
};

export type RemoveClassRelationshipLayoutPayload = {
  id: string;
};

// ─── Repository Interface ─────────────────────────────────────────────────────

export interface IClassDiagramRepository {
  // Diagram operations
  findByModelId(
    query: FindClassDiagramsByModelIdQuery,
  ): Promise<ClassDiagram[]>;
  findById(query: FindClassDiagramByIdQuery): Promise<ClassDiagram | null>;
  create(payload: CreateClassDiagramPayload): Promise<ClassDiagram>;
  update(payload: UpdateClassDiagramPayload): Promise<ClassDiagram>;
  updateLayout(payload: UpdateClassDiagramLayoutPayload): Promise<ClassDiagram>;
  remove(payload: RemoveClassDiagramPayload): Promise<boolean>;

  // Element operations (owned by Model)
  findElementsByModelId(
    query: FindClassElementsByModelIdQuery,
  ): Promise<ClassElement[]>;
  findElementById(
    query: FindClassElementByIdQuery,
  ): Promise<ClassElement | null>;
  createElement(payload: CreateClassElementPayload): Promise<ClassElement>;
  updateElement(payload: UpdateClassElementPayload): Promise<ClassElement>;
  removeElement(payload: RemoveClassElementPayload): Promise<boolean>;

  // Relationship operations (owned by Model)
  findRelationshipsByModelId(
    query: FindClassRelationshipsByModelIdQuery,
  ): Promise<ClassRelationship[]>;
  findRelationshipById(
    query: FindClassRelationshipByIdQuery,
  ): Promise<ClassRelationship | null>;
  createRelationship(
    payload: CreateClassRelationshipPayload,
  ): Promise<ClassRelationship>;
  updateRelationship(
    payload: UpdateClassRelationshipPayload,
  ): Promise<ClassRelationship>;
  removeRelationship(payload: RemoveClassRelationshipPayload): Promise<boolean>;

  // Property operations
  findPropertiesByElementId(
    query: FindClassPropertiesByElementIdQuery,
  ): Promise<ClassProperty[]>;
  findPropertyById(
    query: FindClassElementByIdQuery,
  ): Promise<ClassProperty | null>;
  createProperty(payload: CreateClassPropertyPayload): Promise<ClassProperty>;
  updateProperty(payload: UpdateClassPropertyPayload): Promise<ClassProperty>;
  removeProperty(payload: RemoveClassPropertyPayload): Promise<boolean>;

  // Operation operations
  findOperationsByElementId(
    query: FindClassOperationsByElementIdQuery,
  ): Promise<ClassOperation[]>;
  findOperationById(
    query: FindClassElementByIdQuery,
  ): Promise<ClassOperation | null>;
  createOperation(
    payload: CreateClassOperationPayload,
  ): Promise<ClassOperation>;
  updateOperation(
    payload: UpdateClassOperationPayload,
  ): Promise<ClassOperation>;
  removeOperation(payload: RemoveClassOperationPayload): Promise<boolean>;

  // Operation Parameter operations
  findParametersByOperationId(
    query: FindClassOperationParametersByOperationIdQuery,
  ): Promise<ClassOperationParameter[]>;
  findParameterById(
    query: FindClassElementByIdQuery,
  ): Promise<ClassOperationParameter | null>;
  createParameter(
    payload: CreateClassOperationParameterPayload,
  ): Promise<ClassOperationParameter>;
  updateParameter(
    payload: UpdateClassOperationParameterPayload,
  ): Promise<ClassOperationParameter>;
  removeParameter(
    payload: RemoveClassOperationParameterPayload,
  ): Promise<boolean>;

  // Enumeration Literal operations
  findEnumerationLiteralsByElementId(
    query: FindClassEnumerationLiteralsByElementIdQuery,
  ): Promise<ClassEnumerationLiteral[]>;
  findEnumerationLiteralById(
    query: FindClassElementByIdQuery,
  ): Promise<ClassEnumerationLiteral | null>;
  createEnumerationLiteral(
    payload: CreateClassEnumerationLiteralPayload,
  ): Promise<ClassEnumerationLiteral>;
  updateEnumerationLiteral(
    payload: UpdateClassEnumerationLiteralPayload,
  ): Promise<ClassEnumerationLiteral>;
  removeEnumerationLiteral(
    payload: RemoveClassEnumerationLiteralPayload,
  ): Promise<boolean>;

  // Element Layout operations (view positions)
  findElementLayoutsByDiagramId(
    query: FindClassElementLayoutsByDiagramIdQuery,
  ): Promise<ClassElementLayout[]>;
  findElementLayoutById(
    query: FindClassElementByIdQuery,
  ): Promise<ClassElementLayout | null>;
  createElementLayout(
    payload: CreateClassElementLayoutPayload,
  ): Promise<ClassElementLayout>;
  updateElementLayout(
    payload: UpdateClassElementLayoutPayload,
  ): Promise<ClassElementLayout>;
  removeElementLayout(
    payload: RemoveClassElementLayoutPayload,
  ): Promise<boolean>;

  // Relationship Layout operations
  findRelationshipLayoutsByDiagramId(
    query: FindClassRelationshipLayoutsByDiagramIdQuery,
  ): Promise<ClassRelationshipLayout[]>;
  findRelationshipLayoutById(
    query: FindClassElementByIdQuery,
  ): Promise<ClassRelationshipLayout | null>;
  createRelationshipLayout(
    payload: CreateClassRelationshipLayoutPayload,
  ): Promise<ClassRelationshipLayout>;
  updateRelationshipLayout(
    payload: UpdateClassRelationshipLayoutPayload,
  ): Promise<ClassRelationshipLayout>;
  removeRelationshipLayout(
    payload: RemoveClassRelationshipLayoutPayload,
  ): Promise<boolean>;
}
