"use client";

import type { ScenarioDiagram } from "@/modules/model/domain/entities/scenario-diagram";
import type { ScenarioFragment } from "@/modules/model/domain/entities/scenario-fragment";
import type { ScenarioLifeline } from "@/modules/model/domain/entities/scenario-lifeline";
import type { ScenarioMessage } from "@/modules/model/domain/entities/scenario-message";
import { useCreateScenarioFragment } from "@/modules/model/ui/clients/create-scenario-fragment";
import { useCreateScenarioLifeline } from "@/modules/model/ui/clients/create-scenario-lifeline";
import { useCreateScenarioMessage } from "@/modules/model/ui/clients/create-scenario-message";
import { useDeleteScenarioFragment } from "@/modules/model/ui/clients/delete-scenario-fragment";
import { useDeleteScenarioLifeline } from "@/modules/model/ui/clients/delete-scenario-lifeline";
import { useDeleteScenarioMessage } from "@/modules/model/ui/clients/delete-scenario-message";
import { useUpdateScenarioLayout } from "@/modules/model/ui/clients/update-scenario-layout";
import { ScenarioMessageEdge } from "@/modules/model/ui/components/edges/scenario-message-edge";
import { MessageConnectionDialog } from "@/modules/model/ui/components/message-connection-dialog";
import { FragmentNode } from "@/modules/model/ui/components/nodes/fragment-node";
import { LifelineNode } from "@/modules/model/ui/components/nodes/lifeline-node";
import { getDiagramPalette } from "@/modules/model/ui/helpers/diagram";
import {
  type ScenarioCanvasEdge,
  type ScenarioCanvasNode,
  useScenarioCanvasStore,
} from "@/modules/model/ui/stores/scenario-canvas";
import { useConfirm } from "@/modules/shared/ui/hooks/use-confirm";
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
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const NODE_TYPES = {
  lifeline: LifelineNode,
  fragment: FragmentNode,
} as const;

const EDGE_TYPES = {
  message: ScenarioMessageEdge,
  reply: ScenarioMessageEdge,
  create: ScenarioMessageEdge,
  destroy: ScenarioMessageEdge,
  found: ScenarioMessageEdge,
  lost: ScenarioMessageEdge,
} as const;

export type ScenarioCanvasProps = {
  diagram: ScenarioDiagram;
  lifelines: ScenarioLifeline[];
  messages: ScenarioMessage[];
  fragments: ScenarioFragment[];
};

export function ScenarioCanvas({
  diagram,
  lifelines,
  messages,
  fragments,
}: ScenarioCanvasProps) {
  const reactFlowRef = useRef<HTMLDivElement>(null);
  const [pendingConnection, setPendingConnection] = useState<{
    sourceId: string;
    targetId: string;
    allowedTypes: string[];
  } | null>(null);

  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    selectEdge,
    selectNode,
    selectedNodeId,
    selectedEdgeId,
    pushHistory,
    undo,
    redo,
    initCanvas,
    updateNodePosition,
    reset,
  } = useScenarioCanvasStore();

  const palette = getDiagramPalette(diagram.type.value);

  const createLifeline = useCreateScenarioLifeline();
  const createMessage = useCreateScenarioMessage();
  const createFragment = useCreateScenarioFragment();
  const deleteLifeline = useDeleteScenarioLifeline();
  const deleteMessage = useDeleteScenarioMessage();
  const deleteFragment = useDeleteScenarioFragment();
  const updateLayout = useUpdateScenarioLayout();
  const confirm = useConfirm();

  // Build canvas nodes/edges when all data is ready
  useEffect(() => {
    const lifelineNodes: ScenarioCanvasNode[] = lifelines.map((lifeline) => ({
      id: lifeline.id,
      type: "lifeline",
      position: lifeline.layout.position,
      width: lifeline.layout.size.width,
      height: lifeline.layout.size.height,
      data: {
        id: lifeline.id,
        type: "lifeline",
        position: lifeline.layout.position,
        width: lifeline.layout.size.width,
        height: lifeline.layout.size.height,
        lifeline,
        elementName: lifeline.selector || "Unknown",
        elementType: lifeline.type.value,
        selector: lifeline.selector,
        decomposed: lifeline.decomposed,
      },
    }));

    const fragmentNodes: ScenarioCanvasNode[] = fragments.map((fragment) => ({
      id: fragment.id,
      type: "fragment",
      position: fragment.layout.position,
      width: fragment.layout.size.width,
      height: fragment.layout.size.height,
      data: {
        id: fragment.id,
        type: "fragment",
        position: fragment.layout.position,
        width: fragment.layout.size.width,
        height: fragment.layout.size.height,
        fragment,
        operator: fragment.type.operator.toUpperCase(),
        guard: fragment.guard,
        isCombined: fragment.type.isCombined,
      },
    }));

    const allNodes = [...lifelineNodes, ...fragmentNodes];

    // Sort messages by sequenceOrder
    const sortedMessages = [...messages].sort(
      (a, b) => a.sequenceOrder - b.sequenceOrder,
    );

    // Calculate Y positions based on sequenceOrder
    const MESSAGE_HEIGHT = 60;
    const messageEdges: ScenarioCanvasEdge[] = sortedMessages
      .map((message, index) => {
        const sourceNode = allNodes.find(
          (n) => n.id === message.sourceLifelineId,
        );
        const targetNode = allNodes.find(
          (n) => n.id === message.targetLifelineId,
        );

        if (!sourceNode || !targetNode) {
          return null;
        }

        const y = (index + 1) * MESSAGE_HEIGHT;

        return {
          id: message.id,
          type: "message" as const,
          source: message.sourceLifelineId,
          target: message.targetLifelineId,
          sourceHandle: "right",
          targetHandle: "left",
          data: {
            message,
            sort: message.sort,
            label: message.name,
            signature: message.signature,
            sequenceOrder: message.sequenceOrder,
          },
        };
      })
      .filter(Boolean) as ScenarioCanvasEdge[];

    initCanvas(diagram.id, diagram.modelId, allNodes, messageEdges);

    return () => reset();
  }, [
    diagram.id,
    diagram.modelId,
    lifelines,
    messages,
    fragments,
    initCanvas,
    reset,
  ]);

  const handleConnect: OnConnect = useCallback(
    (connection) => {
      if (!connection.source || !connection.target) return;

      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);
      if (!sourceNode || !targetNode) return;

      // Only allow connections between lifelines
      if (sourceNode.type !== "lifeline" || targetNode.type !== "lifeline") {
        toast.error("Messages can only connect lifelines");
        return;
      }

      const allowedTypes = [
        "sync",
        "async",
        "reply",
        "create",
        "destroy",
        "found",
        "lost",
      ];

      if (allowedTypes.length === 1) {
        createMessage.mutate({
          diagramId: diagram.id,
          sourceLifelineId: connection.source,
          targetLifelineId: connection.target,
          sort: allowedTypes[0] as
            | "sync"
            | "async"
            | "reply"
            | "create"
            | "destroy"
            | "found"
            | "lost",
          name: allowedTypes[0],
          sequenceOrder: nodes.length,
        });
        return;
      }

      setPendingConnection({
        sourceId: connection.source,
        targetId: connection.target,
        allowedTypes,
      });
    },
    [nodes, diagram.id, createMessage],
  );

  const handleConfirm = useCallback(
    (type: string, name: string) => {
      if (!pendingConnection) return;
      createMessage.mutate({
        diagramId: diagram.id,
        sourceLifelineId: pendingConnection.sourceId,
        targetLifelineId: pendingConnection.targetId,
        sort: type as
          | "sync"
          | "async"
          | "reply"
          | "create"
          | "destroy"
          | "found"
          | "lost",
        name,
        sequenceOrder: nodes.length,
      });
      setPendingConnection(null);
    },
    [pendingConnection, diagram.id, nodes.length, createMessage],
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes(applyNodeChanges(changes, nodes) as ScenarioCanvasNode[]);
    },
    [setNodes, nodes],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      setEdges(applyEdgeChanges(changes, edges) as ScenarioCanvasEdge[]);
    },
    [setEdges, edges],
  );

  const onNodeClick: NodeMouseHandler<ScenarioCanvasNode> = useCallback(
    (_, node) => {
      selectNode(node.id);
    },
    [selectNode],
  );

  const onEdgeClick: EdgeMouseHandler<ScenarioCanvasEdge> = useCallback(
    (_, edge) => {
      selectEdge(edge.id);
    },
    [selectEdge],
  );

  const onNodeDragStop: OnNodeDrag<ScenarioCanvasNode> = useCallback(
    (_, node) => {
      pushHistory();
      updateNodePosition(node.id, node.position);

      // Auto-save layout
      const currentNodes = useScenarioCanvasStore.getState().nodes;
      const lifelinePositions = currentNodes
        .filter((n) => n.type === "lifeline")
        .map((n) => ({
          id: n.id,
          position: n.position,
          size: { width: n.width ?? 120, height: n.height ?? 600 },
        }));

      const fragmentPositions = currentNodes
        .filter((n) => n.type === "fragment")
        .map((n) => ({
          id: n.id,
          position: n.position,
          size: { width: n.width ?? 300, height: n.height ?? 200 },
        }));

      updateLayout.mutate({
        diagramId: diagram.id,
        lifelinePositions,
        fragmentPositions,
      });
    },
    [pushHistory, updateNodePosition, diagram.id, updateLayout],
  );

  const handleDrop: React.DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();

      if (!reactFlowRef.current) return;

      const bounds = reactFlowRef.current.getBoundingClientRect();

      const position = {
        x: event.clientX - bounds.left - 60,
        y: event.clientY - bounds.top - 30,
      };

      const elementData = event.dataTransfer.getData(
        "application/explorer-element",
      );
      if (elementData) {
        try {
          const { elementId, elementType, name } = JSON.parse(elementData);

          // Check if already on diagram
          const already = nodes.find(
            (n) => n.id === elementId && n.type === "lifeline",
          );
          if (already) {
            toast.info(`"${name}" is already on this diagram`);
            return;
          }

          // Validate element type against diagram palette
          if (palette && !palette.elementTypes.includes(elementType)) {
            toast.error(
              `Cannot add "${name}" to ${diagram.type.value} diagram. ` +
                `Supported: ${palette.elementTypes.join(", ")}`,
            );
            return;
          }

          pushHistory();

          createLifeline.mutate({
            diagramId: diagram.id,
            elementId,
            type: elementType as
              | "function"
              | "database"
              | "actor"
              | "entity"
              | "component"
              | "boundary"
              | "control"
              | "gate",
            selector: undefined,
          });
        } catch {
          // ignore parse errors
        }
        return;
      }

      // Palette drop - create new lifeline
      const elementType = event.dataTransfer.getData(
        "application/element-type",
      );
      if (elementType) {
        pushHistory();
        createLifeline.mutate({
          diagramId: diagram.id,
          elementId: crypto.randomUUID(),
          type: elementType as
            | "function"
            | "database"
            | "actor"
            | "entity"
            | "component"
            | "boundary"
            | "control"
            | "gate",
          selector: undefined,
        });
      }
    },
    [nodes, diagram, palette, pushHistory, createLifeline],
  );

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    },
    [],
  );

  // Delete selected element
  const handleDeleteSelected = useCallback(async () => {
    if (selectedNodeId) {
      const node = nodes.find((n) => n.id === selectedNodeId);
      if (!node) return;

      const ok = await confirm({
        tone: "danger",
        title: "Delete element",
        description: `Delete this ${node.type === "lifeline" ? "lifeline" : "fragment"}?`,
        confirmText: "Delete",
      });
      if (!ok) return;

      pushHistory();
      if (node.type === "lifeline") {
        deleteLifeline.mutate({ lifelineId: node.id });
      } else if (node.type === "fragment") {
        deleteFragment.mutate({ fragmentId: node.id });
      }
    } else if (selectedEdgeId) {
      const edge = edges.find((e) => e.id === selectedEdgeId);
      if (!edge) return;

      const ok = await confirm({
        tone: "danger",
        title: "Delete message",
        description: "Delete this message?",
        confirmText: "Delete",
      });
      if (!ok) return;

      pushHistory();
      deleteMessage.mutate({ messageId: edge.id });
    }
  }, [
    selectedNodeId,
    selectedEdgeId,
    nodes,
    edges,
    confirm,
    pushHistory,
    deleteLifeline,
    deleteMessage,
    deleteFragment,
  ]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

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
        e.preventDefault();
        handleDeleteSelected();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo, redo, handleDeleteSelected]);

  return (
    <>
      <div ref={reactFlowRef} className="flex-1 h-full w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onNodeDragStop={onNodeDragStop}
          onConnect={handleConnect}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          fitView
          className="bg-background"
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
            className="bg-card! border! border-border! rounded-lg overflow-hidden"
          />
          <Controls
            position="bottom-left"
            className="rounded-lg overflow-hidden border! border-border! [&>button]:bg-card! [&>button]:border-border! [&>button]:fill-foreground!"
          />
        </ReactFlow>
      </div>
      <MessageConnectionDialog
        open={!!pendingConnection}
        onConfirm={handleConfirm}
        onOpenChange={() => setPendingConnection(null)}
        allowedTypes={pendingConnection?.allowedTypes ?? []}
      />
    </>
  );
}
