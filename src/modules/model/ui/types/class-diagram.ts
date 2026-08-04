import type { Viewport } from "./diagram";

export type ClassElementTypeValue =
  | "CLASS"
  | "INTERFACE"
  | "ENUM"
  | "DATA_TYPE"
  | "PRIMITIVE"
  | "COLLECTION"
  | "UNION"
  | "PACKAGE";

export type ClassRelationshipTypeValue =
  | "ASSOCIATION"
  | "GENERALIZATION"
  | "REALIZATION"
  | "DEPENDENCY";

export type AggregationKindValue = "NONE" | "SHARED" | "COMPOSITE";

export type ClassVisibilityValue =
  | "public"
  | "private"
  | "protected"
  | "package";

export type ClassCollectionKindValue =
  | "NONE"
  | "SET"
  | "BAG"
  | "SEQUENCE"
  | "ORDERED_SET";

export type ClassParameterDirectionValue = "IN" | "OUT" | "INOUT";

export type ClassStatus = "DRAFT" | "VALIDATED" | "DEPRECATED";

export type ClassDiagramData = {
  id: string;
  modelId: string;
  name: string;
  description?: string;
  viewport: Viewport;
  status: ClassStatus;
  createdAt: string;
  updatedAt: string;
};

export type ClassElementData = {
  id: string;
  modelId: string;
  layer: string;
  name: string;
  elementType: ClassElementTypeValue;
  isAbstract: boolean;
  isStatic: boolean;
  parentId: string | null;
  ordering: number;
  status: ClassStatus;
  extensionProperties: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type ClassRelationshipData = {
  id: string;
  modelId: string;
  layer: string;
  sourceElementId: string;
  targetElementId: string;
  name: string;
  relationshipType: ClassRelationshipTypeValue;
  aggregationKind: AggregationKindValue;
  isDisjoint: boolean;
  isComplete: boolean;
  isDerived: boolean;
  sourceMultiplicityLower: number;
  sourceMultiplicityUpper: string;
  targetMultiplicityLower: number;
  targetMultiplicityUpper: string;
  sourceRole: string;
  targetRole: string;
  isNavigableSource: boolean;
  isNavigableTarget: boolean;
  status: ClassStatus;
  extensionProperties: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type ClassPropertyData = {
  id: string;
  classElementId: string;
  modelId: string;
  layer: string;
  name: string;
  typeClassElementId: string | null;
  typeLiteral: string;
  isStatic: boolean;
  isReadOnly: boolean;
  isDerived: boolean;
  isID: boolean;
  visibility: ClassVisibilityValue;
  multiplicityLower: number;
  multiplicityUpper: string;
  collectionKind: ClassCollectionKindValue;
  defaultValue: string;
  ordering: number;
  status: ClassStatus;
  createdAt: string;
  updatedAt: string;
};

export type ClassOperationData = {
  id: string;
  classElementId: string;
  modelId: string;
  layer: string;
  name: string;
  returnTypeClassElementId: string | null;
  returnTypeLiteral: string;
  isStatic: boolean;
  isAbstract: boolean;
  isQuery: boolean;
  visibility: ClassVisibilityValue;
  parameters?: ClassOperationParameterData[];
  ordering: number;
  status: ClassStatus;
  createdAt: string;
  updatedAt: string;
};

export type ClassOperationParameterData = {
  id: string;
  classOperationId: string;
  modelId: string;
  layer: string;
  name: string;
  typeClassElementId: string | null;
  multiplicityLower: number;
  multiplicityUpper: string;
  defaultValue: string | null;
  direction: ClassParameterDirectionValue;
  isOrdered: boolean;
  isUnique: boolean;
  ordering: number;
  status: ClassStatus;
  createdAt: string;
  updatedAt: string;
};

export type ClassEnumerationLiteralData = {
  id: string;
  classElementId: string;
  modelId: string;
  layer: string;
  name: string;
  value: string;
  ordering: number;
  status: ClassStatus;
  createdAt: string;
  updatedAt: string;
};

// Node data types for React Flow
export type ClassNodeData = {
  element: ClassElementData;
  properties: ClassPropertyData[];
  operations: ClassOperationData[];
  enumerationLiterals: ClassEnumerationLiteralData[];
  isSelected: boolean;
};

// Edge data types for React Flow
export type ClassEdgeData = {
  relationship: ClassRelationshipData;
  isSelected: boolean;
};
