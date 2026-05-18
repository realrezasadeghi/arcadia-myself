import type { LayerValue } from "./layer";

export type RelationshipTypeValue =
  | "OperationalExchange"
  | "InvolvementLink"
  | "FunctionalExchange"
  | "SystemExchange"
  | "LogicalExchange"
  | "ComponentExchange"
  | "ProvidedInterface"
  | "RequiredInterface"
  | "PhysicalExchange"
  | "PhysicalLink"
  | "DeploymentLink"
  | "Composition";

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
