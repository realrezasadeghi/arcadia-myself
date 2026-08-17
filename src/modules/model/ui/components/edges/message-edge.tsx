"use client";

import {
  getBezierPath,
  EdgeLabelRenderer,
  type EdgeProps,
} from "@xyflow/react";

export function MessageEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeData = data as {
    name?: string;
    kind?: string;
    executionOrder?: number;
    messageId?: string;
  };

  const isReturn = edgeData?.kind === "RETURN" || edgeData?.kind === "REPLY";

  return (
    <>
      <path
        id={String(id)}
        d={edgePath}
        fill="none"
        stroke={selected ? "hsl(var(--primary))" : "hsl(var(--foreground))"}
        strokeWidth={2}
        strokeDasharray={isReturn ? "5,5" : undefined}
        markerEnd="url(#arrowhead)"
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="px-2 py-0.5 text-xs bg-background border border-border rounded font-medium whitespace-nowrap"
        >
          {edgeData?.name}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
