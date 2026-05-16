import { CONNECTION_RULES } from "../constants/connection";
import type { ElementTypeValue } from "../types/element";
import type { RelationshipTypeValue } from "../types/relationship";

export function getAllowedConnectionTypes(
  sourceType: ElementTypeValue | string,
  targetType: ElementTypeValue | string,
): RelationshipTypeValue[] {
  return CONNECTION_RULES.filter(
    (r) =>
      r.allowedSources.includes(sourceType as ElementTypeValue) &&
      r.allowedTargets.includes(targetType as ElementTypeValue),
  ).map((r) => r.relationshipType);
}
