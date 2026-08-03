import {
  RELATIONSHIP_TYPES,
  RELATIONSHIP_VISUAL,
} from "../constants/relationship";
import type {
  RelationshipTypeInfo,
  RelationshipTypeValue,
  RelationshipVisualSpec,
} from "../types/relationship";

export function getRelationshipTypeInfo(
  value: RelationshipTypeValue | string,
): RelationshipTypeInfo {
  return (
    RELATIONSHIP_TYPES.find((r) => r.value === value) ?? {
      label: value,
      labelFa: value,
      allowedFor: [],
      value: value as RelationshipTypeValue,
    }
  );
}

export function getEdgeVisual(
  type: RelationshipTypeValue | string,
): RelationshipVisualSpec {
  return (
    RELATIONSHIP_VISUAL[type as RelationshipTypeValue] ?? {
      strokeColor: "#94a3b8",
      strokeWidth: 1.5,
      arrowEnd: "arrow",
    }
  );
}
