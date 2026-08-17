"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useMemo } from "react";
import { useScenarioDiagramData } from "../hooks/use-scenario-diagram-data";
import type { Diagram } from "../types/diagram";
import type { Element } from "../types/element";
import type { Relationship } from "../types/relationship";
import { FragmentOverlay } from "./fragment-overlay";
import { LifelineNode } from "./nodes/lifeline-node";
import { MessageEdge } from "./edges/message-edge";

const NODE_TYPES = {
  lifeline: LifelineNode,
};

const EDGE_TYPES = {
  message: MessageEdge,
};

type ScenarioCanvasInnerProps = {
  diagram: Diagram;
  elements: Element[];
  relationships: Relationship[];
};

const LIFELINE_SPACING = 200;
const HEADER_HEIGHT = 60;
const ROW_HEIGHT = 120;
const FRAGMENT_PADDING = 16;

export function ScenarioCanvasInner({
  diagram,
  elements,
  relationships,
}: ScenarioCanvasInnerProps) {
  const { lifelines, messages, fragments } = useScenarioDiagramData({
    diagramId: diagram.id,
    modelId: diagram.modelId,
  });

  const nodes = useMemo(() => {
    return lifelines.map((lifeline, index) => ({
      id: `lifeline-${lifeline.id}`,
      type: "lifeline" as const,
      position: {
        x: 100 + index * LIFELINE_SPACING,
        y: HEADER_HEIGHT,
      },
      data: {
        name: lifeline.name,
        representedElementType: lifeline.representedElementType,
        columnIndex: lifeline.columnIndex,
        scenarioId: lifeline.scenarioId,
        lifelineId: lifeline.id,
      },
    }));
  }, [lifelines]);

  const edges = useMemo(() => {
    return messages.map((message) => {
      return {
        id: `message-${message.id}`,
        type: "message" as const,
        source: `lifeline-${message.sourceLifelineId}`,
        target: `lifeline-${message.targetLifelineId}`,
        data: {
          name: message.name,
          kind: message.kind,
          executionOrder: message.executionOrder,
          messageId: message.id,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
        },
      };
    });
  }, [messages]);

  const fragmentOverlays = useMemo(() => {
    return fragments.map((fragment) => {
      const x =
        100 + fragment.columnIndex * LIFELINE_SPACING - FRAGMENT_PADDING;
      const y = HEADER_HEIGHT + fragment.rowIndex * ROW_HEIGHT;
      const width =
        fragment.spanColumns * LIFELINE_SPACING + FRAGMENT_PADDING * 2;
      const height = ROW_HEIGHT + FRAGMENT_PADDING * 2;

      return {
        id: fragment.id,
        name: fragment.name,
        operator: fragment.operator,
        guard: fragment.guard,
        x,
        y,
        width,
        height,
      };
    });
  }, [fragments]);

  return (
    <div className="flex-1 h-full w-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        className="bg-background"
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          type: "message",
        }}
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

      {/* Fragment overlays rendered on top of ReactFlow */}
      {fragmentOverlays.map((fragment) => (
        <FragmentOverlay
          key={fragment.id}
          id={fragment.id}
          name={fragment.name}
          operator={fragment.operator}
          guard={fragment.guard}
          x={fragment.x}
          y={fragment.y}
          width={fragment.width}
          height={fragment.height}
        />
      ))}
    </div>
  );
}
