"use client";

import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  type EdgeMouseHandler,
  MiniMap,
  type NodeMouseHandler,
  type OnEdgesChange,
  type OnNodesChange,
  ReactFlow,
} from "@xyflow/react";
import { useCallback } from "react";
import { getElementVisual } from "../helpers/element";
import {
  type CanvasEdge,
  type CanvasNode,
  useCanvasStore,
} from "../stores/canvas";

import "@xyflow/react/dist/style.css";

export function DiagramCanvasInner() {
  const { nodes, edges, setNodes, setEdges, selectEdge, selectNode } =
    useCanvasStore();

  const getNodeColor = useCallback((node: CanvasNode) => {
    return getElementVisual(node?.data?.elementType)?.strokeColor || "#94a3b8";
  }, []);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes(applyNodeChanges(changes, nodes) as CanvasNode[]);
    },
    [nodes, setNodes],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      setEdges(applyEdgeChanges(changes, edges) as CanvasEdge[]);
    },
    [edges, setEdges],
  );

  const onNodeClick: NodeMouseHandler<CanvasNode> = useCallback(
    (_, node) => {
      selectNode(node.id);
    },
    [selectNode],
  );

  const onEdgeClick: EdgeMouseHandler<CanvasEdge> = useCallback(
    (_, edge) => {
      selectEdge(edge.id);
    },
    [selectEdge],
  );

  return (
    <ReactFlow
      fitView
      nodes={nodes}
      edges={edges}
      deleteKeyCode={"delete"}
      className="bg-background"
      onNodeClick={onNodeClick}
      onEdgeClick={onEdgeClick}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitViewOptions={{ padding: 0.15 }}
    >
      <Background
        gap={20}
        size={1}
        variant={BackgroundVariant.Dots}
        className="[&>pattern]:stroke-border"
      />
      <Controls
        position="bottom-right"
        className="[&>button]:bg-card [&>button]:border-border [&>button]:text-foreground"
      />
      <MiniMap
        position="bottom-left"
        nodeColor={getNodeColor}
        className="bg-card! border! border-border! rounded-lg overflow-hidden"
      />
    </ReactFlow>
  );
}
