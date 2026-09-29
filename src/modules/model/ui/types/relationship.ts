import type { RelationshipTypeValue } from "../../domain/relationships/definitions";
import type { LayerValue } from "./layer";

export type { RelationshipTypeValue };

export type RelationshipTypeInfo = {
  value: RelationshipTypeValue;
  label: string;
  labelFa: string;
  allowedFor: LayerValue[];
};

export type Relationship = {
  id: string;
  modelId: string;
  type: RelationshipTypeValue;
  sourceElementId: string;
  targetElementId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type RelationshipVisualSpec = {
  strokeColor: string;
  strokeWidth: number;
  strokeDash?: string;
  arrowEnd: "arrow" | "open-arrow" | "diamond" | "none";
  animated?: boolean;
};
