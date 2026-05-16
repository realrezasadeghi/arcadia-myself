import { RELATIONSHIP_TYPES } from "../constants/relationship";
import type {
  RelationshipTypeInfo,
  RelationshipTypeValue,
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
