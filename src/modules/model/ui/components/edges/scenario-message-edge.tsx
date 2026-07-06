"use client";

import { BaseEdge, type Edge, type EdgeProps } from "@xyflow/react";
import { memo, useMemo } from "react";
import { getMessageEdgeType, type ScenarioEdgeData } from "@/modules/model/ui/types/scenario";

function ScenarioMessageEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps<Edge<ScenarioEdgeData>>) {
  const { message, sort, label, sequenceOrder } = data ?? {} as ScenarioEdgeData;

  const path = useMemo(() => {
    // Horizontal line for sequence diagrams
    const midY = (sourceY + targetY) / 2;
    return `M ${sourceX} ${sourceY} L ${sourceX} ${midY} L ${targetX} ${midY} L ${targetX} ${targetY}`;
  }, [sourceX, sourceY, targetX, targetY]);

  const edgeType = getMessageEdgeType(sort);

  const style = useMemo(() => {
    const baseStyle: React.CSSProperties = {
      stroke: sort.value === "sync" ? "#1E8449" : sort.value === "async" ? "#2E86C1" : "#94A3B8",
      strokeWidth: selected ? 2.5 : 1.5,
      fill: "none",
    };

    switch (edgeType) {
      case "reply":
        return { ...baseStyle, strokeDasharray: "5,5", stroke: "#94A3B8" };
      case "create":
        return { ...baseStyle, strokeDasharray: "5,5", stroke: "#27AE60" };
      case "destroy":
        return { ...baseStyle, stroke: "#E74C3C" };
      case "found":
        return { ...baseStyle, strokeDasharray: "2,4", stroke: "#7F8C8D" };
      case "lost":
        return { ...baseStyle, strokeDasharray: "2,4", stroke: "#E74C3C" };
      default:
        return baseStyle;
    }
  }, [selected, sort, edgeType]);

  const markerEnd = useMemo(() => {
    switch (edgeType) {
      case "reply":
        return "url(#arrow-open)";
      case "create":
        return "url(#arrow-filled)";
      case "destroy":
        return "url(#arrow-filled)";
      case "found":
        return "url(#arrow-open-dotted)";
      case "lost":
        return "url(#arrow-open-dotted)";
      default:
        return sort.value === "async" ? "url(#arrow-open)" : "url(#arrow-filled)";
    }
  }, [sort, edgeType]);

  return (
    <>
      <defs>
        <marker
          id="arrow-filled"
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="#1E8449" />
        </marker>
        <marker
          id="arrow-open"
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="none" stroke="#2E86C1" strokeWidth="2" />
        </marker>
        <marker
          id="arrow-open-dotted"
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="none" stroke="#7F8C8D" strokeWidth="2" strokeDasharray="2,2" />
        </marker>
      </defs>

      <BaseEdge
        id={id}
        path={path}
        style={style}
        markerEnd={markerEnd}
      />

      {(label || sequenceOrder !== undefined) && (
        <div
          className="absolute pointer-events-none nodrag nopan"
          style={{
            left: (sourceX + targetX) / 2,
            top: (sourceY + targetY) / 2 - 20,
            transform: "translate(-50%, -50%)",
          }}
        >
          <span
            className="rounded px-1 py-0.5 text-[10px] font-medium whitespace-nowrap"
            style={{
              backgroundColor: "hsl(var(--background))",
              color: style.stroke,
              border: `1px solid ${style.stroke}`,
            }}
          >
            {label}
            {sequenceOrder !== undefined && <span className="ml-1 opacity-70">#{sequenceOrder}</span>}
          </span>
        </div>
      )}
    </>
  );
}

export const ScenarioMessageEdge = memo(ScenarioMessageEdgeComponent);