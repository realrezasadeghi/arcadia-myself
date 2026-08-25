import type { Edge, Node, XYPosition } from "@xyflow/react";
import { getNodeTypeForElement } from "../helpers/element";
import type {
  ElementNodeData,
  RelationshipEdgeData,
} from "../stores/arch-canvas";
import type { ElementLayout } from "../types/diagram";
import type { Element } from "../types/element";
import type { RelationshipTypeValue } from "../types/relationship";

export type ArchCanvasNode = Node<ElementNodeData>;

const DEFAULT_NODE_SIZE = { width: 160, height: 60 };

/**
 * Build React Flow nodes from architecture elements + layout data.
 */
export function buildArchNodes(
  elements: Element[],
  elementLayouts: ElementLayout[],
  modelId: string,
): ArchCanvasNode[] {
  const layoutMap = new Map(elementLayouts.map((l) => [l.elementId, l]));

  return elements
    .filter((el) => layoutMap.has(el.id))
    .map((el): ArchCanvasNode | null => {
      const layout = layoutMap.get(el.id);
      if (!layout) return null;

      return {
        id: el.id,
        width: layout.size.width,
        type: getNodeTypeForElement(el.type),
        position: layout.position,
        height: layout.size.height,
        data: {
          name: el.name,
          elementId: el.id,
          status: el.status,
          modelId,
          elementType: el.type,
          description: el.description,
        },
      };
    })
    .filter((n): n is ArchCanvasNode => n !== null);
}

/**
 * Build React Flow edges from architecture relationships.
 * Only includes edges where both source and target exist on the canvas.
 */
export type ArchCanvasEdge = Edge<RelationshipEdgeData>;

export function buildArchEdges(
  relationships: Array<{
    id: string;
    name: string;
    type: string;
    description?: string;
    sourceElementId: string;
    targetElementId: string;
  }>,
  nodeIds: Set<string>,
  modelId: string,
): ArchCanvasEdge[] {
  return relationships
    .filter(
      (rel) =>
        nodeIds.has(rel.sourceElementId) && nodeIds.has(rel.targetElementId),
    )
    .map((rel) => ({
      id: rel.id,
      type: "architecture-edge" as const,
      source: rel.sourceElementId,
      target: rel.targetElementId,
      data: {
        name: rel.name,
        modelId,
        relationshipId: rel.id,
        relationshipType: rel.type as RelationshipTypeValue,
        description: rel.description ?? "",
      },
    }));
}

/**
 * Convert React Flow nodes to absolute layout positions for persistence.
 */
export function nodesToArchLayouts(
  nodes: Array<{
    position: XYPosition;
    data: { elementId: string };
    width?: number;
    height?: number;
  }>,
): ElementLayout[] {
  return nodes.map((node) => ({
    position: node.position,
    elementId: node.data.elementId,
    size: {
      width: node.width ?? DEFAULT_NODE_SIZE.width,
      height: node.height ?? DEFAULT_NODE_SIZE.height,
    },
  }));
}

/**
 * Compute a cascade position for a new node based on existing node count.
 */
export function cascadePosition(nodeCount: number): XYPosition {
  return {
    x: 80 + (nodeCount % 6) * 40,
    y: 80 + (nodeCount % 6) * 40,
  };
}
