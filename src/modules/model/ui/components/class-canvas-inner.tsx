"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { type DragEventHandler, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ClassConnectionPolicy } from "../../domain/policies/class-connection";
import { useCreateClassElement } from "../clients/create-class-element";
import { useCreateClassRelationship } from "../clients/create-class-relationship";
import { getClassDiagramByIdKey } from "../clients/get-class-diagram-by-id";
import { getElementRelationsKey } from "../clients/get-element-relations";
import { useUpdateClassDiagramLayout } from "../clients/update-class-diagram-layout";
import { getClassElementTypeInfo } from "../constants/class-diagram";
import { isContainerType, getDefaultSize, nodesToAbsoluteLayouts } from "../helpers/class-diagram";
import { mapToClassRelationshipType } from "../helpers/class-diagram";
import { getDiagramPalette } from "../helpers/diagram";
import { getElementTypeInfo } from "../helpers/element";
import { useCanvasBehaviour } from "../hooks/use-canvas-behaviour";
import { type CanvasNode, useCanvasStore } from "../stores/canvas";
import { useWorkbenchStore } from "../stores/workbench";
import type { ClassElementTypeValue } from "../types/class-diagram";
import type { Diagram, ElementLayout } from "../types/diagram";
import type { Element, ElementTypeValue } from "../types/element";
import type {
  Relationship,
  RelationshipTypeValue,
} from "../types/relationship";
import { ClassDiagramContextMenu } from "./class-diagram-context-menu";
import { ConnectionDialog } from "./connection-dialog";
import { ClassEdge } from "./edges/class-edge";
import { ClassNode } from "./nodes/class/class-node";
import { PackageNode } from "./nodes/class/package-node";

const NODE_TYPES = {
  "class-node": ClassNode,
  "package-node": PackageNode,
} as const;

const EDGE_TYPES = {
  "class-edge": ClassEdge,
} as const;

type ClassCanvasInnerProps = {
  diagram: Diagram;
  elements: Element[];
  relationships: Relationship[];
};

export function ClassCanvasInner({
  diagram,
  elements,
  relationships,
}: ClassCanvasInnerProps) {
  const router = useRouter();
  const createClassElement = useCreateClassElement();
  const createClassRelationship = useCreateClassRelationship();
  const updateClassDiagramLayout = useUpdateClassDiagramLayout();

  const createRelationship = useCallback(
    (payload: {
      name: string;
      description?: string;
      sourceElementId: string;
      targetElementId: string;
      type: RelationshipTypeValue;
    }) => {
      const { modelId, pushHistory, addEdge } = useCanvasStore.getState();
      if (!modelId) return;

      // Get the layer from the active tab in workbench store
      const activeTab = useWorkbenchStore
        .getState()
        .tabs.find((t) => t.diagramId === useCanvasStore.getState().diagramId);
      const layer = activeTab?.layer ?? "LA";

      pushHistory();

      createClassRelationship.mutate(
        {
          modelId,
          layer,
          name: payload.name,
          description: payload.description,
          relationshipType: payload.type as any,
          sourceElementId: payload.sourceElementId,
          targetElementId: payload.targetElementId,
        },
        {
          onSuccess: ({ data: rel }) => {
            const r = rel as any;
            addEdge({
              id: r.id,
              type: "class-edge",
              source: payload.sourceElementId,
              target: payload.targetElementId,
              data: {
                modelId,
                name: r.name,
                relationshipId: r.id,
                relationshipType: r.relationshipType ?? payload.type,
                description: r.description ?? "",
                aggregationKind: r.aggregationKind ?? "NONE",
                sourceMultiplicityLower: r.sourceMultiplicityLower ?? 1,
                sourceMultiplicityUpper: r.sourceMultiplicityUpper ?? "1",
                targetMultiplicityLower: r.targetMultiplicityLower ?? 1,
                targetMultiplicityUpper: r.targetMultiplicityUpper ?? "1",
                sourceRole: r.sourceRole ?? "",
                targetRole: r.targetRole ?? "",
                isNavigableSource: r.isNavigableSource ?? false,
                isNavigableTarget: r.isNavigableTarget ?? false,
              },
            });
          },
          onError: ({ message }) => {
            toast.error(message || "Error creating class relationship");
          },
        },
      );
    },
    [createClassRelationship],
  );

  const {
    reactFlowRef,
    nodes,
    edges,
    diagramId,
    modelId,
    pendingConnection,
    selectNode,
    pushHistory,
    addNode,
    initCanvas,
    reset,
    setPendingConnection,
    clearInsertRequest,
    queryClient,
    onNodesChange,
    onEdgesChange,
    onNodeClick,
    onEdgeClick,
    onNodeDragStop,
    handleDragOver,
    handleConfirm,
  } = useCanvasBehaviour({
    onConfirm: (type, name, description) => {
      if (!pendingConnection) return;
      createRelationship({
        name,
        description,
        type,
        sourceElementId: pendingConnection.sourceNodeId,
        targetElementId: pendingConnection.targetNodeId,
      });
    },
  });

  // Initialize canvas on mount, clean up on unmount
  // biome-ignore lint/correctness/useExhaustiveDependencies: initCanvas and reset are stable
  useEffect(() => {
    initCanvas(diagram.id, diagram.modelId, [], []);
    return () => reset();
  }, [initCanvas, reset, diagram.id, diagram.modelId]);

  // Sync nodes/edges when elements/relationships data changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: setNodes/setEdges are stable
  useEffect(() => {
    const layoutMap = new Map(
      diagram.elementLayouts.map((l) => [l.elementId, l]),
    );

    // Build a map of element ID to element data for parent lookups
    const elementMap = new Map(elements.map((e) => [e.id, e]));

    const newNodes = elements
      .filter((element) => layoutMap.has(element.id))
      .map((element) => {
        const layout = layoutMap.get(element.id)!;
        const isContainer = isContainerType(element.type as any);
        const parentId = (element as any).parentId as string | null;
        
        // Only set parentId if parent is also on this diagram
        const effectiveParentId = 
          parentId && layoutMap.has(parentId) ? parentId : undefined;

        return {
          id: element.id,
          width: layout.size.width,
          type: isContainer ? "package-node" : "class-node",
          position: effectiveParentId 
            ? { x: 0, y: 0 }  // Will be calculated relative to parent
            : layout.position,
          parentId: effectiveParentId,
          extent: effectiveParentId ? ("parent" as const) : undefined,
          height: layout.size.height,
          zIndex: isContainer ? -1 : 0,
          data: {
            name: element.name,
            elementId: element.id,
            status: element.status,
            modelId: diagram.modelId,
            elementType: element.type,
            description: element.description,
            parentId: parentId,
            isAbstract: (element as any).isAbstract ?? false,
            isStatic: (element as any).isStatic ?? false,
            properties: (element as any).properties ?? [],
            operations: (element as any).operations ?? [],
            enumerationLiterals: (element as any).enumerationLiterals ?? [],
          },
        };
      });

    // Calculate relative positions for children
    const nodesById = new Map(newNodes.map((n) => [n.id, n]));
    for (const node of newNodes) {
      if (node.parentId) {
        const parent = nodesById.get(node.parentId);
        if (parent) {
          // Get absolute positions for both parent and child
          const parentAbs = layoutMap.get(parent.data.elementId)?.position ?? parent.position;
          const childAbs = layoutMap.get(node.data.elementId)?.position ?? node.position;
          // Child position is relative to parent
          node.position = {
            x: childAbs.x - parentAbs.x,
            y: childAbs.y - parentAbs.y,
          };
        }
      }
    }

    // Merge with existing canvas nodes: preserve nodes that were just added
    // (exist in canvas but not yet in query data / layout map)
    const syncedIds = new Set(newNodes.map((n) => n.id));
    const existingNodes = useCanvasStore.getState().nodes;
    const orphans = existingNodes.filter((n) => !syncedIds.has(n.id));
    const mergedNodes = [...newNodes, ...orphans];

    const nodeIds = new Set(newNodes.map((n) => n.id));

    const newEdges = relationships
      .filter(
        (relationship) =>
          nodeIds.has(relationship.sourceElementId) &&
          nodeIds.has(relationship.targetElementId),
      )
      .map((relationship) => ({
        id: relationship.id,
        type: "class-edge" as const,
        source: relationship.sourceElementId,
        target: relationship.targetElementId,
        data: {
          name: relationship.name,
          modelId: diagram.modelId,
          relationshipId: relationship.id,
          relationshipType: (relationship as any).aggregationKind
            ? (relationship as any).relationshipType
            : mapToClassRelationshipType(relationship.type),
          description: relationship?.description ?? "",
          aggregationKind: (relationship as any).aggregationKind ?? "NONE",
          sourceMultiplicityLower:
            (relationship as any).sourceMultiplicityLower ?? 1,
          sourceMultiplicityUpper:
            (relationship as any).sourceMultiplicityUpper ?? "1",
          targetMultiplicityLower:
            (relationship as any).targetMultiplicityLower ?? 1,
          targetMultiplicityUpper:
            (relationship as any).targetMultiplicityUpper ?? "1",
          sourceRole: (relationship as any).sourceRole ?? "",
          targetRole: (relationship as any).targetRole ?? "",
          isNavigableSource: (relationship as any).isNavigableSource ?? false,
          isNavigableTarget: (relationship as any).isNavigableTarget ?? false,
        },
      }));

    useCanvasStore.getState().setNodes(mergedNodes);
    useCanvasStore.getState().setEdges(newEdges);
  }, [elements, relationships, diagram.elementLayouts, diagram.modelId]);

  const handleConnect = useCallback(
    (connection: { source?: string | null; target?: string | null }) => {
      if (!connection.source || !connection.target) return;

      const currentNodes = useCanvasStore.getState().nodes;
      const sourceNode = currentNodes.find((n) => n.id === connection.source);
      const targetNode = currentNodes.find((n) => n.id === connection.target);
      if (!sourceNode || !targetNode) return;

      const sourceType = getElementTypeInfo(sourceNode.data.elementType).value;
      const targetType = getElementTypeInfo(targetNode.data.elementType).value;
      if (!sourceType || !targetType) return;

      const allowedTypes = ClassConnectionPolicy.getAllowedRelationshipTypes(
        sourceType,
        targetType,
      ).map((rt) => rt.value as unknown as RelationshipTypeValue);

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
    [setPendingConnection, createRelationship],
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

          const elementLayouts = nodesToAbsoluteLayouts(currentNodes);

          const isContainer = isContainerType(elementType);
          const defaultSize = getDefaultSize(elementType);

          updateClassDiagramLayout.mutate(
            {
              id: String(diagramId),
              modelId: String(modelId),
              elementLayouts: [
                ...elementLayouts,
                { position, elementId, size: defaultSize },
              ],
            },
            {
              onSuccess: () => {
                addNode({
                  id: elementId,
                  type: isContainer ? "package-node" : "class-node",
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
                queryClient.invalidateQueries({
                  queryKey: getElementRelationsKey(elementId),
                });
                queryClient.invalidateQueries({
                  queryKey: getClassDiagramByIdKey(String(diagramId)),
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

      // Get the layer from the active tab in workbench store
      const activeTab = useWorkbenchStore
        .getState()
        .tabs.find((t) => t.diagramId === useCanvasStore.getState().diagramId);
      const layer = activeTab?.layer ?? "LA";

      createClassElement.mutate(
        {
          modelId: String(modelId),
          layer,
          name: getClassElementTypeInfo(elementType as ClassElementTypeValue)
            .label,
          elementType: elementType as any,
        },
        {
          onSuccess: ({ data: element }) => {
            const el = element as any;
            const currentNodes = useCanvasStore.getState().nodes;
            const elementLayouts = nodesToAbsoluteLayouts(currentNodes);

            const isContainer = isContainerType(elementType as ClassElementTypeValue);
            const defaultSize = getDefaultSize(elementType as ClassElementTypeValue);

            const elementLayoutItem = {
              position,
              elementId: el.id,
              size: defaultSize,
            };

            updateClassDiagramLayout.mutate(
              {
                id: String(diagramId),
                modelId: String(modelId),
                elementLayouts: [...elementLayouts, elementLayoutItem],
              },
              {
                onError: ({ message }) => {
                  toast.error(message || "Error adding element");
                },
                onSuccess: () => {
                  addNode({
                    id: el.id,
                    type: isContainer ? "package-node" : "class-node",
                    position,
                    data: {
                      name: el.name,
                      elementId: el.id,
                      elementType: el.elementType,
                      modelId: String(modelId),
                      description: el.description,
                      status: (el.status ?? "DRAFT") as "DRAFT",
                      isAbstract: el.isAbstract ?? false,
                      isStatic: el.isStatic ?? false,
                      properties: [],
                      operations: [],
                      enumerationLiterals: [],
                    },
                  });
                  queryClient.invalidateQueries({
                    queryKey: getClassDiagramByIdKey(String(diagramId)),
                  });
                  queryClient.invalidateQueries({
                    queryKey: ["class-elements"],
                  });
                  router.refresh();
                },
              },
            );
          },
          onError: ({ message }) => {
            toast.error(message || "Error adding class element");
          },
        },
      );
    },
    [
      pushHistory,
      modelId,
      diagramId,
      createClassElement,
      updateClassDiagramLayout,
      addNode,
      selectNode,
      queryClient,
    ],
  );

  // Insert request from explorer (add existing element to diagram)
  const insertRequest = useCanvasStore((s) => s.insertRequest);
  useEffect(() => {
    if (!insertRequest) return;
    if (!diagramId || !modelId) return;

    const consume = () => clearInsertRequest();

    const currentNodes = useCanvasStore.getState().nodes;
    const already = currentNodes.find((n) => n.id === insertRequest.elementId);
    if (already) {
      selectNode(already.id);
      consume();
      return;
    }

    pushHistory();

    const position = {
      x: 80 + (currentNodes.length % 6) * 40,
      y: 80 + (currentNodes.length % 6) * 40,
    };

    const existingLayouts = nodesToAbsoluteLayouts(currentNodes);

    const isContainer = isContainerType(insertRequest.elementType as ClassElementTypeValue);
    const defaultSize = getDefaultSize(insertRequest.elementType as ClassElementTypeValue);

    updateClassDiagramLayout.mutate(
      {
        id: String(diagramId),
        modelId: String(modelId),
        elementLayouts: [
          ...existingLayouts,
          {
            position,
            elementId: insertRequest.elementId,
            size: defaultSize,
          },
        ],
      },
      {
        onSuccess: () => {
          const fullElement = elements.find(
            (e) => e.id === insertRequest.elementId,
          );
          let nodeData: any = {
            name: insertRequest.name,
            elementId: insertRequest.elementId,
            elementType: insertRequest.elementType,
            modelId: String(modelId),
            description: insertRequest.description,
            status: insertRequest.status,
          };

          if (fullElement) {
            nodeData = {
              ...nodeData,
              isAbstract: (fullElement as any).isAbstract ?? false,
              isStatic: (fullElement as any).isStatic ?? false,
              properties: (fullElement as any).properties ?? [],
              operations: (fullElement as any).operations ?? [],
              enumerationLiterals:
                (fullElement as any).enumerationLiterals ?? [],
            };
          }

          addNode({
            id: insertRequest.elementId,
            type: isContainer ? "package-node" : "class-node",
            position,
            data: nodeData,
          });
          selectNode(insertRequest.elementId);
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
    updateClassDiagramLayout,
    addNode,
    selectNode,
    clearInsertRequest,
    queryClient,
    elements,
  ]);

  const getNodeColor = useCallback((node: CanvasNode) => {
    const type = node?.data?.elementType;
    if (!type) return "#94a3b8";
    return getClassElementTypeInfo(type as ClassElementTypeValue).color;
  }, []);

  return (
    <>
      <ClassDiagramContextMenu>
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
      </ClassDiagramContextMenu>
      <ConnectionDialog
        open={!!pendingConnection}
        onConfirm={handleConfirm}
        onOpenChange={() => setPendingConnection(null)}
        allowedTypes={pendingConnection?.allowedTypes ?? []}
      />
    </>
  );
}
