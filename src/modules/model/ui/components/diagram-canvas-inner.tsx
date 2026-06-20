"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  type EdgeMouseHandler,
  MiniMap,
  type NodeMouseHandler,
  type OnConnect,
  type OnEdgesChange,
  type OnNodeDrag,
  type OnNodesChange,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { type DragEventHandler, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { ConnectionPolicy } from "../../domain/policies/connection";
import { useConnectElements } from "../clients/connect-elements";
import { useCreateElement } from "../clients/create-element";
import { getElementRelationsKey } from "../clients/get-element-relations";
import { useUpdateDiagramLayout } from "../clients/update-diagram-layout";
import { getDiagramPalette } from "../helpers/diagram";
import {
  getElementTypeInfo,
  getElementVisual,
  getNodeTypeForElement,
} from "../helpers/element";
import { useRemoveElementSync } from "../hooks/use-remove-element";
import { useRemoveRelationshipSync } from "../hooks/use-remove-relationship";
import { useSaveManager } from "../hooks/use-save-manager";
import {
  type CanvasEdge,
  type CanvasNode,
  useCanvasStore,
} from "../stores/canvas";
import { useWorkbenchStore } from "../stores/workbench";
import type { Diagram, ElementLayout } from "../types/diagram";
import type { Element, ElementTypeValue } from "../types/element";
import type {
  Relationship,
  RelationshipTypeValue,
} from "../types/relationship";
import { ArchitectureEdge } from "./architecture-edge";
import { ArchitectureNode } from "./architecture-node";
import { ConnectionDialog } from "./connection-dialog";
import { ActorNode } from "./nodes/actor-node";
import { ComponentNode } from "./nodes/component-node";
import { FunctionNode } from "./nodes/function-node";

const NODE_TYPES = {
  "architecture-node": ArchitectureNode,
  "actor-node": ActorNode,
  "function-node": FunctionNode,
  "component-node": ComponentNode,
} as const;
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
    initCanvas,
    updateNodePosition,
    setPendingConnection,
    selectedEdgeId,
    selectedNodeId,
    pendingConnection,
    insertRequest,
    clearInsertRequest,
  } = useCanvasStore();

  const { removeElement } = useRemoveElementSync();

  const { removeRelationship } = useRemoveRelationshipSync();

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
          type: getNodeTypeForElement(element.type),
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
        type: "architecture-edge",
        source: relationship.sourceElementId,
        target: relationship.targetElementId,
        data: {
          name: relationship.name,
          modelId: diagram.modelId,
          relationshipId: relationship.id,
          relationshipType: relationship.type,
          description: relationship?.description ?? "",
        },
      }));

    initCanvas(diagram.id, diagram.modelId, nodes, edges);

    return () => reset();
  }, [initCanvas, reset]);

  // Auto-select element when selectedElementId changes (e.g. from explorer navigation)
  const selectedElementId = useWorkbenchStore((s) => s.selectedElementId);
  useEffect(() => {
    if (selectedElementId) {
      const currentNodes = useCanvasStore.getState().nodes;
      const node = currentNodes.find((n) => n.id === selectedElementId);
      if (node) {
        selectNode(selectedElementId);
      }
    }
  }, [selectedElementId, selectNode]);

  const createElement = useCreateElement();

  const connectElements = useConnectElements();

  const updateDiagramLayout = useUpdateDiagramLayout();

  const queryClient = useQueryClient();

  const getNodeColor = useCallback((node: CanvasNode) => {
    return getElementVisual(node?.data?.elementType)?.strokeColor || "#94a3b8";
  }, []);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      const currentNodes = useCanvasStore.getState().nodes;
      setNodes(applyNodeChanges(changes, currentNodes) as CanvasNode[]);
    },
    [setNodes],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      const currentEdges = useCanvasStore.getState().edges;
      setEdges(applyEdgeChanges(changes, currentEdges) as CanvasEdge[]);
    },
    [setEdges],
  );

  const onNodeClick: NodeMouseHandler<CanvasNode> = useCallback(
    (_, node) => {
      selectNode(node.id);
      // همگام‌سازی انتخاب با Workbench (برای Semantic Browser و درخت)
      useWorkbenchStore.getState().selectElement(node.id);
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
                modelId,
                name: relationship.name,
                relationshipId: relationship.id,
                relationshipType: relationship.type,
                description: relationship.description ?? "",
              },
            });
          },
          onError: ({ message }) => {
            toast.error(
              message || "Error creating relationship between elements",
            );
          },
        },
      );
    },
    [pushHistory, modelId, connectElements, addEdge],
  );

  const handleConnect: OnConnect = useCallback(
    (connection) => {
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
        toast.error("Cannot create a connection between these two elements.");
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

      if (!reactFlowRef.current || !modelId || !diagramId) return;

      const bounds = reactFlowRef.current.getBoundingClientRect();
      const position = {
        y: event.clientY - bounds.top - 30,
        x: event.clientX - bounds.left - 80,
      };

      // ─── Explorer element drop (existing element) ────────────────────────
      const explorerData = event.dataTransfer.getData(
        "application/explorer-element",
      );
      if (explorerData) {
        try {
          const { elementId, elementType, name, status, description } =
            JSON.parse(explorerData);

          const currentNodes = useCanvasStore.getState().nodes;
          const already = currentNodes.find((n) => n.id === elementId);
          if (already) {
            toast.info(`"${name}" is already on this diagram`);
            return;
          }

          // Validate element type against diagram palette
          const activeTab = useWorkbenchStore
            .getState()
            .tabs.find((t) => t.diagramId === diagramId);
          if (activeTab) {
            const diagPalette = getDiagramPalette(activeTab.type);
            if (!diagPalette.elementTypes.includes(elementType)) {
              toast.error(
                `Cannot add "${name}" to ${activeTab.type} diagram. ` +
                  `This diagram only supports: ${diagPalette.elementTypes.join(", ")}`,
              );
              return;
            }
          }

          pushHistory();

          const elementLayouts: ElementLayout[] = currentNodes.map((node) => ({
            position: node.position,
            elementId: node.data.elementId,
            size: { width: node.width ?? 160, height: node.height ?? 60 },
          }));

          updateDiagramLayout.mutate(
            {
              id: String(diagramId),
              elementLayouts: [
                ...elementLayouts,
                { position, elementId, size: { width: 160, height: 60 } },
              ],
            },
            {
              onSuccess: () => {
                addNode({
                  id: elementId,
                  type: getNodeTypeForElement(elementType),
                  position,
                  data: {
                    name,
                    elementId,
                    elementType,
                    modelId: String(modelId),
                    description: description ?? "",
                    status: status ?? "DRAFT",
                  },
                });
                selectNode(elementId);
                // Refresh the Semantic Browser's "Appears in Diagrams" list.
                queryClient.invalidateQueries({
                  queryKey: getElementRelationsKey(elementId),
                });
                toast.success(`Added "${name}" to diagram`);
              },
              onError: ({ message }) =>
                toast.error(message || "Error adding element to diagram"),
            },
          );
        } catch {
          // ignore parse errors
        }
        return;
      }

      // ─── Palette drop (new element) ──────────────────────────────────────
      const elementType = event.dataTransfer.getData(
        "application/element-type",
      ) as ElementTypeValue;

      if (!elementType) return;

      pushHistory();

      const elementTypeInfo = getElementTypeInfo(elementType);

      createElement.mutate(
        {
          type: elementType,
          layer: elementTypeInfo.layer,
          modelId: String(modelId),
          name: elementTypeInfo.label,
        },
        {
          onSuccess: ({ data: element }) => {
            const currentNodes = useCanvasStore.getState().nodes;
            const elementLayouts: ElementLayout[] = currentNodes.map(
              (node) => ({
                position: node.position,
                elementId: node.data.elementId,
                size: { width: node.width ?? 160, height: node.height ?? 60 },
              }),
            );

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
                  toast.error(message || "Error adding element");
                },
                onSuccess: () => {
                  addNode({
                    id: element.id,
                    type: getNodeTypeForElement(element.type),
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
            toast.error(message || "Error adding element");
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
      selectNode,
      queryClient,
    ],
  );

  const handleDragOver: DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    },
    [],
  );

  /**
   * مصرف درخواست افزودن یک المنت *موجود* به دیاگرام فعال (از Project Explorer).
   * مانند ابزار Insert در Capella: فقط نمای گرافیکی اضافه می‌شود، المنت جدیدی
   * ساخته نمی‌شود. اگر المنت از قبل روی canvas باشد، فقط انتخاب می‌شود.
   */
  useEffect(() => {
    if (!insertRequest) return;
    if (!diagramId || !modelId) return;

    // فقط برای دیاگرام فعال؛ المنت باید به همان model تعلق داشته باشد.
    const consume = () => clearInsertRequest();

    const currentNodes = useCanvasStore.getState().nodes;
    const already = currentNodes.find((n) => n.id === insertRequest.elementId);
    if (already) {
      selectNode(already.id);
      consume();
      return;
    }

    pushHistory();

    // قرار دادن المنت با کمی آفست تا روی هم نیفتند.
    const position = {
      x: 80 + (currentNodes.length % 6) * 40,
      y: 80 + (currentNodes.length % 6) * 40,
    };

    const existingLayouts: ElementLayout[] = currentNodes.map((node) => ({
      position: node.position,
      elementId: node.data.elementId,
      size: { width: node.width ?? 160, height: node.height ?? 60 },
    }));

    updateDiagramLayout.mutate(
      {
        id: String(diagramId),
        elementLayouts: [
          ...existingLayouts,
          {
            position,
            elementId: insertRequest.elementId,
            size: { width: 160, height: 60 },
          },
        ],
      },
      {
        onSuccess: () => {
          addNode({
            id: insertRequest.elementId,
            type: getNodeTypeForElement(insertRequest.elementType),
            position,
            data: {
              name: insertRequest.name,
              elementId: insertRequest.elementId,
              elementType: insertRequest.elementType,
              modelId: String(modelId),
              description: insertRequest.description,
              status: insertRequest.status,
            },
          });
          selectNode(insertRequest.elementId);
          // Refresh the Semantic Browser's "Appears in Diagrams" list.
          queryClient.invalidateQueries({
            queryKey: getElementRelationsKey(insertRequest.elementId),
          });
        },
        onError: ({ message }) =>
          toast.error(message || "Error adding element to diagram"),
      },
    );

    consume();
  }, [
    insertRequest,
    diagramId,
    modelId,
    pushHistory,
    updateDiagramLayout,
    addNode,
    selectNode,
    clearInsertRequest,
    queryClient,
  ]);

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
          removeElement(selectedNodeId);
        } else if (selectedEdgeId) {
          removeRelationship(selectedEdgeId);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    removeElement,
    removeRelationship,
    undo,
    redo,
    selectedNodeId,
    selectedEdgeId,
  ]);

  return (
    <>
      <div ref={reactFlowRef} className="flex-1 h-full w-full">
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
            pannable
            zoomable
            position="bottom-right"
            nodeColor={getNodeColor}
            className="bg-card! border! border-border! rounded-lg overflow-hidden"
          />

          <Controls
            position="bottom-left"
            className="rounded-lg overflow-hidden border! border-border! [&>button]:bg-card! [&>button]:border-border! [&>button]:fill-foreground!"
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
