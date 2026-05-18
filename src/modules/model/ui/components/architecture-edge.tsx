import {
  BaseEdge,
  type Edge,
  EdgeLabelRenderer,
  type EdgeProps,
  getBezierPath,
} from "@xyflow/react";
import { memo } from "react";
import { getEdgeVisual } from "../helpers/relationship";
import type { RelationshipEdgeData } from "../stores/canvas";

function ArchitectureEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps<Edge<RelationshipEdgeData>>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const spec = data?.relationshipType
    ? getEdgeVisual(data.relationshipType)
    : null;

  const strokeColor = spec?.strokeColor ?? "#94a3b8";
  const strokeWidth = selected
    ? (spec?.strokeWidth ?? 1.5) + 1
    : (spec?.strokeWidth ?? 1.5);
  const strokeDash = spec?.strokeDash ?? "0";

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth,
          strokeDasharray: strokeDash,
        }}
      />

      {/* Arrow marker — rendered inline via SVG marker */}
      {data?.name && (
        <EdgeLabelRenderer>
          <div
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
            className="absolute pointer-events-none nodrag nopan"
          >
            <span
              className="rounded px-1 py-0.5 text-[10px] font-medium"
              style={{
                backgroundColor: "hsl(var(--background))",
                color: strokeColor,
                border: `1px solid ${strokeColor}`,
              }}
            >
              {data.name}
            </span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const ArchitectureEdge = memo(ArchitectureEdgeComponent);
