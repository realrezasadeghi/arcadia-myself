import { getRelationshipDefinition } from "./definitions";

export interface RelationshipLabelInput {
  sourceName: string;
  targetName: string;
  value: string;
  /**
   * Set when the pair has to be read the other way round (the shown direction
   * is target → source), so the `reverse` phrase is used instead of `forward`.
   */
  reversed?: boolean;
}

/**
 * Builds a readable sentence for a relationship between two named elements,
 * e.g. `SystemFunction realizes OperationalActivity`.
 *
 * Falls back to `source → target` when the value is unknown.
 */
export function resolveRelationshipLabel(
  input: RelationshipLabelInput,
): string {
  const definition = getRelationshipDefinition(input.value);
  if (!definition) return `${input.sourceName} → ${input.targetName}`;

  const phrase = input.reversed ? definition.reverse : definition.forward;

  return `${input.sourceName} ${phrase} ${input.targetName}`;
}
