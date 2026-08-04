import type { Node } from "@xyflow/react";
import type {
  ClassElementTypeValue,
  ClassRelationshipTypeValue,
} from "../types/class-diagram";

export type ClassNodeData = {
  name: string;
  modelId: string;
  elementId: string;
  description?: string;
  elementType: ClassElementTypeValue;
  status: "DRAFT" | "VALIDATED" | "DEPRECATED";
  isAbstract?: boolean;
  isStatic?: boolean;
  parentId?: string | null;
  properties?: Array<{
    id: string;
    name: string;
    typeLiteral: string;
    visibility: "public" | "private" | "protected" | "package";
    isStatic: boolean;
    isReadOnly: boolean;
    isDerived: boolean;
    isID: boolean;
    multiplicityLower: number;
    multiplicityUpper: string;
    collectionKind: string;
    defaultValue: string;
  }>;
  operations?: Array<{
    id: string;
    name: string;
    returnTypeLiteral: string;
    visibility: "public" | "private" | "protected" | "package";
    isStatic: boolean;
    isAbstract: boolean;
    isQuery: boolean;
    parameters?: Array<{
      id: string;
      name: string;
      typeClassElementId: string | null;
      typeLiteral: string;
      multiplicityLower: number;
      multiplicityUpper: string;
      defaultValue: string | null;
      direction: string;
      isOrdered: boolean;
      isUnique: boolean;
    }>;
  }>;
  enumerationLiterals?: Array<{
    id: string;
    name: string;
    value: string;
  }>;
};

export type ClassEdgeData = {
  name: string;
  modelId: string;
  relationshipId: string;
  description: string;
  relationshipType: ClassRelationshipTypeValue;
  aggregationKind?: "NONE" | "SHARED" | "COMPOSITE";
  isDisjoint?: boolean;
  isComplete?: boolean;
  isDerived?: boolean;
  sourceMultiplicityLower?: number;
  sourceMultiplicityUpper?: string;
  targetMultiplicityLower?: number;
  targetMultiplicityUpper?: string;
  sourceRole?: string;
  targetRole?: string;
  isNavigableSource?: boolean;
  isNavigableTarget?: boolean;
};

export type ClassCanvasNode = Node<ClassNodeData>;
