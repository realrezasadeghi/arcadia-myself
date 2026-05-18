"use client";

import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  type EdgeMouseHandler,
  MiniMap,
  type NodeMouseHandler,
  type OnConnect,
  type OnEdgesChange,
  type OnNodeDrag,
  type OnNodesChange,
  ReactFlow,
} from "@xyflow/react";
import { type DragEventHandler, useCallback, useEffect, useRef } from "react";
import { getElementTypeInfo, getElementVisual } from "../helpers/element";
import {
  type CanvasEdge,
  type CanvasNode,
  useCanvasStore,
} from "../stores/canvas";

import "@xyflow/react/dist/style.css";
import { toast } from "sonner";
import { ConnectionPolicy } from "../../domain/policies/connection";
import { useConnectElements } from "../clients/connect-elements";
import { useCreateElement } from "../clients/create-element";
import { useUpdateDiagramLayout } from "../clients/update-diagram-layout";
import { useSaveManager } from "../hooks/use-save-manager";
import type { Diagram, ElementLayout } from "../types/diagram";
import type { Element, ElementTypeValue } from "../types/element";
import type {
  Relationship,
  RelationshipTypeValue,
} from "../types/relationship";
import { ArchitectureEdge } from "./architecture-edge";
import { ArchitectureNode } from "./architecture-node";
import { ConnectionDialog } from "./connection-dialog";

const NODE_TYPES = { "architecture-node": ArchitectureNode } as const;
const EDGE_TYPES = { "architecture-edge": ArchitectureEdge } as const;

export type DiagramCanvasInnerProps = {
  diagram: Diagram;
  elements: Element[];
  relationships: Relationship[];
};

export function DiagramCanvasInner({
  diagram,
  elements,
  relationships,
}: DiagramCanvasInnerProps) {
  const reactFlowRef = useRef<HTMLDivElement>(null);

  const { notifyChange } = useSaveManager();

  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    selectEdge,
    selectNode,
    pushHistory,
    redo,
    undo,
    addNode,
    diagramId,
    modelId,
    reset,
    addEdge,
    removeNode,
    removeEdge,
    initCanvas,
    updateNodePosition,
    setPendingConnection,
    selectedEdgeId,
    selectedNodeId,
    pendingConnection,
  } = useCanvasStore();

  // Build canvas nodes/edges when all data is ready
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const layoutMap = new Map(
      diagram.elementLayouts.map((l) => [l.elementId, l]),
    );

    const nodes: CanvasNode[] = elements
      .filter((element) => layoutMap.has(element.id))
      .map((element) => {
        const layout = layoutMap.get(element.id)!;
        return {
          id: element.id,
          width: layout.size.width,
          type: "architecture-node",
          position: layout.position,
          height: layout.size.height,
          data: {
            name: element.name,
            elementId: element.id,
            status: element.status,
            modelId: diagram.modelId,
            elementType: element.type,
            description: element.description,
          },
        };
      });

    const nodeIds = new Set(nodes.map((n) => n.id));

    const edges: CanvasEdge[] = relationships
      .filter(
        (relationship) =>
          nodeIds.has(relationship.sourceElementId) &&
          nodeIds.has(relationship.targetElementId),
      )
      .map((relationship) => ({
        id: relationship.id,
        source: relationship.sourceElementId,
        target: relationship.targetElementId,
        type: "architecture-edge",
        data: {
          name: relationship.name,
          relationshipId: relationship.id,
          relationshipType: relationship.type,
        },
      }));

    initCanvas(diagram.id, diagram.modelId, nodes, edges);

    return () => reset();
  }, [initCanvas, reset]);

  const createElement = useCreateElement();

  const connectElements = useConnectElements();

  const updateDiagramLayout = useUpdateDiagramLayout();

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

  const onNodeDragStop: OnNodeDrag<CanvasNode> = useCallback(
    (_, node) => {
      pushHistory();
      updateNodePosition(node.id, node.position);
      notifyChange();
    },
    [updateNodePosition, pushHistory, notifyChange],
  );

  const createRelationship = useCallback(
    (payload: {
      name: string;
      sourceElementId: string;
      targetElementId: string;
      type: RelationshipTypeValue;
    }) => {
      if (!modelId) {
        return;
      }

      pushHistory();

      connectElements.mutate(
        {
          modelId,
          name: payload.name,
          relationshipType: payload.type,
          sourceElementId: payload.sourceElementId,
          targetElementId: payload.targetElementId,
        },
        {
          onSuccess: ({ data: relationship }) => {
            addEdge({
              id: relationship.id,
              type: "architecture-edge",
              source: payload.sourceElementId,
              target: payload.targetElementId,
              data: {
                name: relationship.name,
                relationshipId: relationship.id,
                relationshipType: relationship.type,
              },
            });
          },
          onError: ({ message }) => {
            toast.error(message || "خطا در ایجاد رابطه بین المنت ها");
          },
        },
      );
    },
    [pushHistory, modelId, connectElements, addEdge],
  );

  const handleConnect: OnConnect = useCallback(
    (connection) => {
      console.log("connection", connection);
      if (!connection.source || !connection.target) return;

      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);
      if (!sourceNode || !targetNode) return;

      const sourceType = getElementTypeInfo(sourceNode.data.elementType).value;
      const targetType = getElementTypeInfo(targetNode.data.elementType).value;
      if (!sourceType || !targetType) return;

      const allowedTypes = ConnectionPolicy.getAllowedTypes(
        sourceType,
        targetType,
      ).map((rt) => rt.value) as RelationshipTypeValue[];

      if (allowedTypes.length === 0) {
        toast.error("امکان ایجاد ارتباط بین این دو المنت وجود ندارد.");
        return;
      }

      if (allowedTypes.length === 1) {
        createRelationship({
          name: allowedTypes[0],
          type: allowedTypes[0],
          sourceElementId: connection.source,
          targetElementId: connection.target,
        });
        return;
      }

      setPendingConnection({
        allowedTypes,
        sourceNodeId: connection.source,
        targetNodeId: connection.target,
      });
    },
    [nodes, setPendingConnection, createRelationship],
  );

  const handleConfirm = useCallback(
    (type: RelationshipTypeValue, name: string) => {
      if (!pendingConnection) return;
      createRelationship({
        name: name,
        type: type,
        sourceElementId: pendingConnection.sourceNodeId,
        targetElementId: pendingConnection.targetNodeId,
      });
    },
    [pendingConnection, createRelationship],
  );

  const handleDrop: DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();

      const elementType = event.dataTransfer.getData(
        "application/element-type",
      ) as ElementTypeValue;

      if (!elementType || !reactFlowRef.current) return;

      const bounds = reactFlowRef.current.getBoundingClientRect();

      const position = {
        y: event.clientY - bounds.top - 30,
        x: event.clientX - bounds.left - 80,
      };

      if (!modelId || !diagramId) {
        return;
      }

      pushHistory();

      const elementTypeInfo = getElementTypeInfo(elementType);

      createElement.mutate(
        {
          type: elementType,
          modelId: String(modelId),
          name: elementTypeInfo.label,
        },
        {
          onSuccess: ({ data: element }) => {
            const elementLayouts: ElementLayout[] = nodes.map((node) => ({
              position: node.position,
              elementId: node.data.elementId,
              size: { width: node.width ?? 160, height: node.height ?? 60 },
            }));

            const elementLayoutItem = {
              position,
              elementId: element.id,
              size: { width: 160, height: 60 },
            };

            updateDiagramLayout.mutate(
              {
                id: String(diagramId),
                elementLayouts: [...elementLayouts, elementLayoutItem],
              },
              {
                onError: ({ message }) => {
                  toast.error(message || "خطا در اضافه کردن المنت");
                },
                onSuccess: (data) => {
                  addNode({
                    id: element.id,
                    type: "architecture-node",
                    position,
                    data: {
                      name: element.name,
                      elementId: element.id,
                      elementType: element.type,
                      modelId: String(modelId),
                      description: element.description,
                      status: element.properties.status,
                    },
                  });
                },
              },
            );
          },
          onError: ({ message }) => {
            toast.error(message || "خطا در اضافه کردن المنت");
          },
        },
      );
    },
    [
      pushHistory,
      modelId,
      diagramId,
      createElement,
      updateDiagramLayout,
      addNode,
      nodes,
    ],
  );

  const handleDragOver: DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      console.log("event", event);
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    },
    [],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z") ||
        ((e.ctrlKey || e.metaKey) && e.key === "y")
      ) {
        e.preventDefault();
        redo();
        return;
      }
      // Delete selected
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        e.target === document.body
      ) {
        if (selectedNodeId) {
          pushHistory();
          removeNode(selectedNodeId);
        } else if (selectedEdgeId) {
          pushHistory();
          removeEdge(selectedEdgeId);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    removeNode,
    removeEdge,
    undo,
    redo,
    pushHistory,
    selectedNodeId,
    selectedEdgeId,
  ]);

  return (
    <>
      <div ref={reactFlowRef} className="flex-1 h-screen">
        <ReactFlow
          fitView
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          deleteKeyCode={"delete"}
          className="bg-background"
          onDrop={handleDrop}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onDragOver={handleDragOver}
          onNodesChange={onNodesChange}
          onConnect={handleConnect}
          onEdgesChange={onEdgesChange}
          onNodeDragStop={onNodeDragStop}
          fitViewOptions={{ padding: 0.15 }}
        >
          <Background
            gap={20}
            size={1}
            variant={BackgroundVariant.Dots}
            className="[&>pattern]:stroke-border"
          />

          <MiniMap
            position="top-left"
            nodeColor={getNodeColor}
            className="bg-card! border! border-border! rounded-lg overflow-hidden"
          />
        </ReactFlow>
      </div>
      <ConnectionDialog
        open={!!pendingConnection}
        onConfirm={handleConfirm}
        onOpenChange={() => setPendingConnection(null)}
        allowedTypes={pendingConnection?.allowedTypes ?? []}
      />
    </>
  );
}
