import { getRelationshipDefinition } from "../../domain/relationships/definitions";
import {
  RELATIONSHIP_TYPES,
  RELATIONSHIP_VISUAL,
} from "../constants/relationship";
import type {
  RelationshipTypeInfo,
  RelationshipTypeValue,
  RelationshipVisualSpec,
} from "../types/relationship";

/**
 * Last-resort label for a relationship value the registries don't know about:
 * `ASSOCIATION` → "Association", `ComponentAssembly` → "Component Assembly".
 */
export function humanizeRelationshipTypeName(value: string): string {
  const words = value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[\s_-]+/)
    .filter(Boolean);

  if (words.length === 0) return value;

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function getRelationshipTypeInfo(
  value: RelationshipTypeValue | string,
): RelationshipTypeInfo {
  const known = RELATIONSHIP_TYPES.find((r) => r.value === value);
  if (known) return known;

  const definition = getRelationshipDefinition(value);

  return {
    label: definition?.label ?? humanizeRelationshipTypeName(value),
    labelFa: definition?.labelFa ?? humanizeRelationshipTypeName(value),
    allowedFor: [],
    value: value as RelationshipTypeValue,
  };
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
