import type { Viewport } from "./diagram";

export type ClassElementTypeValue =
  | "CLASS"
  | "INTERFACE"
  | "ENUM"
  | "DATA_TYPE"
  | "PRIMITIVE"
  | "COLLECTION"
  | "UNION"
  | "PACKAGE"
  | "GROUP";

export type ClassRelationshipTypeValue =
  | "ASSOCIATION"
  | "GENERALIZATION"
  | "REALIZATION"
  | "DEPENDENCY";

export type AggregationKindValue = "NONE" | "SHARED" | "COMPOSITE";

export type ClassVisibilityValue = "public" | "private" | "protected" | "package";

export type ClassCollectionKindValue = "NONE" | "SET" | "BAG" | "SEQUENCE" | "ORDERED_SET";

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

// Element type metadata for palette and display
export type ClassElementTypeInfo = {
  value: ClassElementTypeValue;
  label: string;
  labelFa: string;
  description: string;
  color: string;
  shape: "rectangle" | "rounded-rectangle" | "ellipse";
};

export const CLASS_ELEMENT_TYPES: ClassElementTypeInfo[] = [
  { value: "CLASS", label: "Class", labelFa: "کلاس", description: "A standard UML class", color: "#2563EB", shape: "rectangle" },
  { value: "INTERFACE", label: "Interface", labelFa: "رابط", description: "A UML interface", color: "#16A34A", shape: "rectangle" },
  { value: "ENUM", label: "Enumeration", labelFa: "شمارش", description: "An enumeration type", color: "#9333EA", shape: "rectangle" },
  { value: "DATA_TYPE", label: "Data Type", labelFa: "نوع داده", description: "A data type", color: "#DC2626", shape: "rounded-rectangle" },
  { value: "PRIMITIVE", label: "Primitive", labelFa: "ابتدایی", description: "A primitive type", color: "#EA580C", shape: "rounded-rectangle" },
  { value: "COLLECTION", label: "Collection", labelFa: "مجموعه", description: "A collection type", color: "#0891B2", shape: "rounded-rectangle" },
  { value: "UNION", label: "Union", labelFa: "اتحاد", description: "A union type", color: "#CA8A04", shape: "rounded-rectangle" },
];

// Relationship type metadata
export type ClassRelationshipTypeInfo = {
  value: ClassRelationshipTypeValue;
  label: string;
  labelFa: string;
  description: string;
  strokeColor: string;
  strokeWidth: number;
  strokeDash?: string;
  markerEnd?: string;
};

export const CLASS_RELATIONSHIP_TYPES: ClassRelationshipTypeInfo[] = [
  { value: "ASSOCIATION", label: "Association", labelFa: "ارتباط", description: "Structural relationship", strokeColor: "#374151", strokeWidth: 2 },
  { value: "GENERALIZATION", label: "Generalization", labelFa: "تعمیم", description: "Inheritance relationship", strokeColor: "#374151", strokeWidth: 2, markerEnd: "generalization" },
  { value: "REALIZATION", label: "Realization", labelFa: "تحقق", description: "Interface implementation", strokeColor: "#374151", strokeWidth: 2, strokeDash: "8,4", markerEnd: "realization" },
  { value: "DEPENDENCY", label: "Dependency", labelFa: "وابستگی", description: "Usage relationship", strokeColor: "#9CA3AF", strokeWidth: 1, strokeDash: "4,4" },
];

// Aggregation kind metadata
export const AGGREGATION_KIND_INFO: Record<AggregationKindValue, { label: string; labelFa: string; description: string }> = {
  NONE: { label: "None", labelFa: "بدون", description: "No aggregation" },
  SHARED: { label: "Shared", labelFa: "مشترک", description: "Aggregation (hollow diamond)" },
  COMPOSITE: { label: "Composite", labelFa: "ترکیبی", description: "Composition (filled diamond)" },
};

// Visibility metadata
export const CLASS_VISIBILITY_INFO: Record<ClassVisibilityValue, { symbol: string; label: string; labelFa: string }> = {
  public: { symbol: "+", label: "Public", labelFa: "عمومی" },
  private: { symbol: "-", label: "Private", labelFa: "خصوصی" },
  protected: { symbol: "#", label: "Protected", labelFa: "محافظت‌شده" },
  package: { symbol: "~", label: "Package", labelFa: "پکیج" },
};

// Helper functions
export function getClassElementTypeInfo(type: ClassElementTypeValue): ClassElementTypeInfo {
  return CLASS_ELEMENT_TYPES.find((t) => t.value === type) ?? CLASS_ELEMENT_TYPES[0];
}

export function getClassRelationshipTypeInfo(type: ClassRelationshipTypeValue): ClassRelationshipTypeInfo {
  return CLASS_RELATIONSHIP_TYPES.find((t) => t.value === type) ?? CLASS_RELATIONSHIP_TYPES[0];
}

export function getVisibilitySymbol(visibility: ClassVisibilityValue): string {
  return CLASS_VISIBILITY_INFO[visibility]?.symbol ?? "+";
}

export function formatMultiplicity(lower: number, upper: string): string {
  if (lower === 1 && upper === "1") return "";
  if (lower === 0 && upper === "*") return "0..*";
  if (String(lower) === upper) return `${lower}`;
  return `${lower}..${upper}`;
}
