import { cn } from "@/modules/shared/ui/libs/cn";
import { type Edge, type EdgeProps, getBezierPath } from "@xyflow/react";
import { memo } from "react";
import { getClassRelationshipTypeInfo, formatMultiplicity } from "../../constants/class-diagram";
import type { ClassEdgeData } from "../../stores/canvas";

type ClassEdgeType = Edge<ClassEdgeData>;

function DiamondMarker({
  fill = "none",
  stroke = "currentColor",
  strokeWidth = 1.5,
  size = 10,
  id,
}: {
  id: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  size?: number;
}) {
  const half = size / 2;
  return (
    <defs>
      <marker
        id={id}
        markerWidth={size}
        markerHeight={size}
        refX={half}
        refY={half}
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path
          d={`M ${half} 0 L ${size} ${half} L ${half} ${size} L 0 ${half} Z`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      </marker>
    </defs>
  );
}

function ArrowMarker({
  id,
  color,
  width = 8,
  height = 6,
  filled = true,
}: {
  id: string;
  color: string;
  width?: number;
  height?: number;
  filled?: boolean;
}) {
  return (
    <defs>
      <marker
        id={id}
        markerWidth={width}
        markerHeight={height}
        refX={filled ? width : 0}
        refY={height / 2}
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path
          d={`M 0 0 L ${width} ${height / 2} L 0 ${height} Z`}
          fill={filled ? color : "none"}
          stroke={filled ? "none" : color}
          strokeWidth={filled ? 0 : 1.5}
        />
      </marker>
    </defs>
  );
}

function ClassEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps<ClassEdgeType>) {
  if (!data) return null;

  const relTypeInfo = getClassRelationshipTypeInfo(data.relationshipType);

  const isGeneralization = data.relationshipType === "GENERALIZATION";
  const isRealization = data.relationshipType === "REALIZATION";
  const isDependency = data.relationshipType === "DEPENDENCY";
  const isAssociation = data.relationshipType === "ASSOCIATION";

  const aggKind = data.aggregationKind ?? "NONE";
  const isComposite = aggKind === "COMPOSITE";
  const isShared = aggKind === "SHARED";

  const strokeColor = relTypeInfo.strokeColor;
  const strokeWidth = relTypeInfo.strokeWidth;
  const strokeDash = relTypeInfo.strokeDash;

  const sourceMultLower = data.sourceMultiplicityLower ?? 1;
  const sourceMultUpper = data.sourceMultiplicityUpper ?? "1";
  const targetMultLower = data.targetMultiplicityLower ?? 1;
  const targetMultUpper = data.targetMultiplicityUpper ?? "1";
  const sourceRole = data.sourceRole ?? "";
  const targetRole = data.targetRole ?? "";
  const isNavigableSource = data.isNavigableSource ?? false;
  const isNavigableTarget = data.isNavigableTarget ?? false;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Build marker IDs with edge prefix to avoid collisions
  const markerIds = {
    generalization: `${id}-generalization`,
    realization: `${id}-realization`,
    dependency: `${id}-dependency`,
    navSource: `${id}-nav-source`,
    navTarget: `${id}-nav-target`,
    aggregation: `${id}-aggregation`,
    composition: `${id}-composition`,
  };

  const sourceMarker = isComposite
    ? markerIds.composition
    : isShared
      ? markerIds.aggregation
      : isAssociation && isNavigableSource
        ? markerIds.navSource
        : undefined;

  const targetMarker = isGeneralization
    ? markerIds.generalization
    : isRealization
      ? markerIds.realization
      : isDependency
        ? markerIds.dependency
        : isAssociation && isNavigableTarget
          ? markerIds.navTarget
          : undefined;

  return (
    <>
      {/* SVG marker definitions */}
      {isGeneralization && (
        <ArrowMarker id={markerIds.generalization} color={strokeColor} filled={false} />
      )}
      {isRealization && (
        <ArrowMarker id={markerIds.realization} color={strokeColor} filled={false} />
      )}
      {isDependency && (
        <ArrowMarker
          id={markerIds.dependency}
          color={strokeColor}
          filled={false}
          width={6}
          height={4}
        />
      )}
      {isAssociation && isNavigableSource && (
        <ArrowMarker id={markerIds.navSource} color={strokeColor} />
      )}
      {isAssociation && isNavigableTarget && (
        <ArrowMarker id={markerIds.navTarget} color={strokeColor} />
      )}
      {isShared && (
        <DiamondMarker id={markerIds.aggregation} fill="none" stroke={strokeColor} />
      )}
      {isComposite && (
        <DiamondMarker id={markerIds.composition} fill={strokeColor} stroke={strokeColor} />
      )}

      {/* Edge path */}
      <path
        id={`edge-path-${id}`}
        d={edgePath}
        className={cn(
          "transition-all duration-150",
          selected && "stroke-primary",
        )}
        stroke={strokeColor}
        strokeWidth={selected ? strokeWidth + 1 : strokeWidth}
        strokeDasharray={strokeDash}
        fill="none"
        markerStart={sourceMarker ? `url(#${sourceMarker})` : undefined}
        markerEnd={targetMarker ? `url(#${targetMarker})` : undefined}
        style={{
          filter: selected ? "drop-shadow(0 0 2px hsl(var(--primary)))" : undefined,
        }}
      />

      {/* Relationship Name */}
      {data.name && (
        <text
          x={labelX}
          y={labelY - 8}
          textAnchor="middle"
          style={{
            fontSize: "9px",
            fill: strokeColor,
            fontWeight: 500,
            pointerEvents: "none",
          }}
        >
          {data.name}
        </text>
      )}

      {/* Source Multiplicity */}
      {isAssociation && sourceMultLower !== 1 && (
        <text
          x={sourceX + (targetX - sourceX) * 0.1}
          y={sourceY + (targetY - sourceY) * 0.1 - 6}
          textAnchor="start"
          style={{
            fontSize: "8px",
            fill: strokeColor,
            opacity: 0.8,
            pointerEvents: "none",
          }}
        >
          {formatMultiplicity(sourceMultLower, sourceMultUpper)}
        </text>
      )}

      {/* Target Multiplicity */}
      {isAssociation && targetMultLower !== 1 && (
        <text
          x={sourceX + (targetX - sourceX) * 0.9}
          y={sourceY + (targetY - sourceY) * 0.9 - 6}
          textAnchor="end"
          style={{
            fontSize: "8px",
            fill: strokeColor,
            opacity: 0.8,
            pointerEvents: "none",
          }}
        >
          {formatMultiplicity(targetMultLower, targetMultUpper)}
        </text>
      )}

      {/* Source Role Name */}
      {isAssociation && sourceRole && (
        <text
          x={sourceX + (targetX - sourceX) * 0.1}
          y={sourceY + (targetY - sourceY) * 0.1 + 12}
          textAnchor="start"
          style={{
            fontSize: "8px",
            fill: strokeColor,
            opacity: 0.7,
            fontStyle: "italic",
            pointerEvents: "none",
          }}
        >
          {sourceRole}
        </text>
      )}

      {/* Target Role Name */}
      {isAssociation && targetRole && (
        <text
          x={sourceX + (targetX - sourceX) * 0.9}
          y={sourceY + (targetY - sourceY) * 0.9 + 12}
          textAnchor="end"
          style={{
            fontSize: "8px",
            fill: strokeColor,
            opacity: 0.7,
            fontStyle: "italic",
            pointerEvents: "none",
          }}
        >
          {targetRole}
        </text>
      )}

      {/* Aggregation/Composition diamond indicator */}
      {(isShared || isComposite) && (
        <text
          x={sourceX + (targetX - sourceX) * 0.05}
          y={sourceY + (targetY - sourceY) * 0.05 - 10}
          textAnchor="start"
          style={{ fontSize: "10px", fill: strokeColor, pointerEvents: "none" }}
        >
          {isComposite ? "◆" : "◇"}
        </text>
      )}
    </>
  );
}

export const ClassEdge = memo(ClassEdgeComponent);
