import {
  BaseEdge,
  type Edge,
  EdgeLabelRenderer,
  type EdgeProps,
  getBezierPath,
} from "@xyflow/react";
import { memo } from "react";
import type { AssociationEdgeData } from "../../../infrastructure/projections/edge-mappers/association-edge.mapper";

type AssociationEdgeType = Edge<AssociationEdgeData>;

function AssociationEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerStart,
  markerEnd,
  style,
  selected,
}: EdgeProps<AssociationEdgeType>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const strokeWidth = selected
    ? ((style?.strokeWidth as number) ?? 1.5) + 1
    : ((style?.strokeWidth as number) ?? 1.5);

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerStart={markerStart}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth,
        }}
      />
      <EdgeLabelRenderer>
        {/* Association name at center */}
        {data?.name && (
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="text-[10px] bg-background/80 px-1 rounded text-muted-foreground"
          >
            {data.name}
          </div>
        )}

        {/* Source multiplicity near source */}
        {data?.sourceMultiplicity && (
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${sourceX + (targetX - sourceX) * 0.15}px,${sourceY + (targetY - sourceY) * 0.15}px)`,
              pointerEvents: "all",
            }}
            className="text-[9px] text-muted-foreground"
          >
            {data.sourceMultiplicity}
          </div>
        )}

        {/* Target multiplicity near target */}
        {data?.targetMultiplicity && (
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${targetX - (targetX - sourceX) * 0.15}px,${targetY - (targetY - sourceY) * 0.15}px)`,
              pointerEvents: "all",
            }}
            className="text-[9px] text-muted-foreground"
          >
            {data.targetMultiplicity}
          </div>
        )}

        {/* Source role near source */}
        {data?.sourceRole && (
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, 100%) translate(${sourceX + (targetX - sourceX) * 0.15}px,${sourceY + (targetY - sourceY) * 0.15}px)`,
              pointerEvents: "all",
            }}
            className="text-[9px] italic text-muted-foreground"
          >
            {data.sourceRole}
          </div>
        )}

        {/* Target role near target */}
        {data?.targetRole && (
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, 100%) translate(${targetX - (targetX - sourceX) * 0.15}px,${targetY - (targetY - sourceY) * 0.15}px)`,
              pointerEvents: "all",
            }}
            className="text-[9px] italic text-muted-foreground"
          >
            {data.targetRole}
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
}

export const AssociationEdge = memo(AssociationEdgeComponent);
