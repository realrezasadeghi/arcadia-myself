"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import dagre from "dagre";
import { useCanvasStore, type CanvasNode, type ClassNodeData } from "../stores/canvas";
import { useUpdateDiagramLayout } from "../clients/update-diagram-layout";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 120;

/**
 * Hook for applying dagre-based auto-layout to class diagram nodes.
 * Repositions all nodes on the canvas using a top-down hierarchical layout.
 */
export function useClassDiagramLayout() {
  const nodes = useCanvasStore((s) => s.nodes);
  const edges = useCanvasStore((s) => s.edges);
  const setNodes = useCanvasStore((s) => s.setNodes);
  const pushHistory = useCanvasStore((s) => s.pushHistory);
  const diagramId = useCanvasStore((s) => s.diagramId);
  const updateDiagramLayout = useUpdateDiagramLayout();

  const applyLayout = useCallback(() => {
    if (nodes.length === 0) return;

    pushHistory();

    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({
      rankdir: "TB",
      nodesep: 80,
      ranksep: 100,
      marginx: 40,
      marginy: 40,
    });

    for (const node of nodes) {
      g.setNode(node.id, {
        width: node.width ?? NODE_WIDTH,
        height: node.height ?? NODE_HEIGHT,
      });
    }

    for (const edge of edges) {
      if (g.hasNode(edge.source) && g.hasNode(edge.target)) {
        g.setEdge(edge.source, edge.target);
      }
    }

    dagre.layout(g);

    const newNodes: CanvasNode[] = nodes.map((node) => {
      const dagreNode = g.node(node.id);
      if (!dagreNode) return node;
      return {
        ...node,
        position: {
          x: dagreNode.x - (node.width ?? NODE_WIDTH) / 2,
          y: dagreNode.y - (node.height ?? NODE_HEIGHT) / 2,
        },
      };
    });

    setNodes(newNodes);

    // Persist the new layout to the server
    if (diagramId) {
      const elementLayouts = newNodes.map((node) => ({
        elementId: node.id,
        position: node.position,
        size: {
          width: node.width ?? NODE_WIDTH,
          height: node.height ?? NODE_HEIGHT,
        },
      }));

      updateDiagramLayout.mutate(
        { id: diagramId, elementLayouts },
        {
          onError: ({ message }) => {
            toast.error(message || "Error saving layout");
          },
        },
      );
    }

    toast.success("Layout applied");
  }, [nodes, edges, setNodes, pushHistory, diagramId, updateDiagramLayout]);

  return { applyLayout };
}
