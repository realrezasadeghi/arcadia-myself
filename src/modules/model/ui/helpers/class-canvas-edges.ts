import type { Edge } from "@xyflow/react";
import type { ClassEdgeData } from "../stores/class-canvas";
import type {
  ClassRelationshipData,
  ClassRelationshipTypeValue,
} from "../types/class-diagram";

export type ClassCanvasEdge = Edge<ClassEdgeData>;

/**
 * Build React Flow edges from class relationships.
 * Only includes edges where both source and target exist on the canvas.
 */
export function buildClassEdges(
  relationships: ClassRelationshipData[],
  nodeIds: Set<string>,
  modelId: string,
): ClassCanvasEdge[] {
  return relationships
    .filter(
      (rel) =>
        nodeIds.has(rel.sourceElementId) && nodeIds.has(rel.targetElementId),
    )
    .map((rel) => ({
      id: rel.id,
      type: "class-edge" as const,
      source: rel.sourceElementId,
      target: rel.targetElementId,
      data: {
        name: rel.name,
        modelId,
        relationshipId: rel.id,
        relationshipType: rel.relationshipType as ClassRelationshipTypeValue,
        description: "",
        aggregationKind: rel.aggregationKind,
        sourceMultiplicityLower: rel.sourceMultiplicityLower,
        sourceMultiplicityUpper: rel.sourceMultiplicityUpper,
        targetMultiplicityLower: rel.targetMultiplicityLower,
        targetMultiplicityUpper: rel.targetMultiplicityUpper,
        sourceRole: rel.sourceRole,
        targetRole: rel.targetRole,
        isNavigableSource: rel.isNavigableSource,
        isNavigableTarget: rel.isNavigableTarget,
      },
    }));
}

/**
 * Build a ClassEdgeData from a newly-created relationship response.
 * The server response uses `string` for enums, so we cast to the union type.
 */
export function buildEdgeDataFromCreatedRelationship(opts: {
  id: string;
  name: string;
  modelId: string;
  sourceElementId: string;
  targetElementId: string;
  relationshipType: string;
  aggregationKind: string;
  sourceMultiplicityLower: number;
  sourceMultiplicityUpper: string;
  targetMultiplicityLower: number;
  targetMultiplicityUpper: string;
  sourceRole: string;
  targetRole: string;
  isNavigableSource: boolean;
  isNavigableTarget: boolean;
  description: string;
}): ClassCanvasEdge {
  return {
    id: opts.id,
    type: "class-edge",
    source: opts.sourceElementId,
    target: opts.targetElementId,
    data: {
      name: opts.name,
      modelId: opts.modelId,
      relationshipId: opts.id,
      relationshipType: opts.relationshipType as ClassRelationshipTypeValue,
      description: opts.description,
      aggregationKind: opts.aggregationKind as ClassEdgeData["aggregationKind"],
      sourceMultiplicityLower: opts.sourceMultiplicityLower,
      sourceMultiplicityUpper: opts.sourceMultiplicityUpper,
      targetMultiplicityLower: opts.targetMultiplicityLower,
      targetMultiplicityUpper: opts.targetMultiplicityUpper,
      sourceRole: opts.sourceRole,
      targetRole: opts.targetRole,
      isNavigableSource: opts.isNavigableSource,
      isNavigableTarget: opts.isNavigableTarget,
    },
  };
}
