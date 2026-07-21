import dagre from "dagre";
import type { ClassElementData, ClassRelationshipData } from "../types/class-diagram";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 120;

export type LayoutNode = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export function computeLayout(
  elements: ClassElementData[],
  relationships: ClassRelationshipData[]
): Map<string, { x: number; y: number }> {
  const g = new dagre.graphlib.Graph();

  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: "TB",
    nodesep: 80,
    ranksep: 100,
    marginx: 40,
    marginy: 40,
  });

  for (const el of elements) {
    g.setNode(el.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }

  for (const rel of relationships) {
    if (g.hasNode(rel.sourceElementId) && g.hasNode(rel.targetElementId)) {
      g.setEdge(rel.sourceElementId, rel.targetElementId);
    }
  }

  dagre.layout(g);

  const positions = new Map<string, { x: number; y: number }>();

  for (const el of elements) {
    const node = g.node(el.id);
    if (node) {
      positions.set(el.id, {
        x: node.x - NODE_WIDTH / 2,
        y: node.y - NODE_HEIGHT / 2,
      });
    }
  }

  return positions;
}
