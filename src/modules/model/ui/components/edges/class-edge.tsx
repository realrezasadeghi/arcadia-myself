import { cn } from "@/modules/shared/ui/libs/cn";
import { type Edge, type EdgeProps, getBezierPath } from "@xyflow/react";
import { memo } from "react";
import {
  getClassRelationshipTypeInfo,
  formatMultiplicity,
} from "../../constants/class-diagram";
import type { ClassEdgeData } from "../../stores/canvas";

type ClassEdgeType = Edge<ClassEdgeData>;

function DiamondMarker({
  fill = "none",
  stroke = "currentColor",
  strokeWidth = 1.5,
  size = 12,
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
        refX={size - 1}
        refY={half}
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path
          d={`M 0 ${half} L ${half} 0 L ${size} ${half} L ${half} ${size} Z`}
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
  width = 10,
  height = 7,
  filled = true,
}: {
  id: string;
  color: string;
  width?: number;
  height?: number;
  filled?: boolean;
}) {
  const halfH = height / 2;
  const refX = filled ? width : width;
  return (
    <defs>
      <marker
        id={id}
        markerWidth={width}
        markerHeight={height}
        refX={refX}
        refY={halfH}
        orient="auto"
        markerUnits="strokeWidth"
      >
        {filled ? (
          <path
            d={`M 0 0 L ${width} ${halfH} L 0 ${height} Z`}
            fill={color}
          />
        ) : (
          <path
            d={`M 0 0 L ${width} ${halfH} L 0 ${height}`}
            fill="none"
            stroke={color}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        )}
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
  const isDerived = data.isDerived ?? false;

  const derivedPrefix = isDerived ? "/" : "";

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const markerIds = {
    generalization: `${id}-gen`,
    realization: `${id}-real`,
    dependency: `${id}-dep`,
    navSource: `${id}-nav-src`,
    navTarget: `${id}-nav-tgt`,
    aggregation: `${id}-agg`,
    composition: `${id}-comp`,
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

  const sourceMult = formatMultiplicity(sourceMultLower, sourceMultUpper);
  const targetMult = formatMultiplicity(targetMultLower, targetMultUpper);

  return (
    <>
      {isGeneralization && (
        <ArrowMarker
          id={markerIds.generalization}
          color={strokeColor}
          filled={false}
        />
      )}
      {isRealization && (
        <ArrowMarker
          id={markerIds.realization}
          color={strokeColor}
          filled={false}
        />
      )}
      {isDependency && (
        <ArrowMarker
          id={markerIds.dependency}
          color={strokeColor}
          filled={false}
          width={8}
          height={5}
        />
      )}
      {isAssociation && isNavigableSource && (
        <ArrowMarker id={markerIds.navSource} color={strokeColor} />
      )}
      {isAssociation && isNavigableTarget && (
        <ArrowMarker id={markerIds.navTarget} color={strokeColor} />
      )}
      {isShared && (
        <DiamondMarker
          id={markerIds.aggregation}
          fill="white"
          stroke={strokeColor}
        />
      )}
      {isComposite && (
        <DiamondMarker
          id={markerIds.composition}
          fill={strokeColor}
          stroke={strokeColor}
        />
      )}

      {/* Invisible wider hit area */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ cursor: "pointer" }}
      />

      {/* Visible edge path */}
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
          filter: selected
            ? "drop-shadow(0 0 3px rgba(37, 99, 235, 0.4))"
            : undefined,
        }}
      />

      {/* Relationship Name with background */}
      {(data.name || isDerived) && (
        <g>
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            style={{
              fontSize: "10px",
              fontWeight: 500,
              pointerEvents: "none",
            }}
          >
            <tspan
              fill="white"
              fillOpacity={0.92}
              stroke="white"
              strokeWidth={3}
              strokeLinejoin="round"
            >
              {derivedPrefix}
              {data.name}
            </tspan>
          </text>
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            style={{
              fontSize: "10px",
              fill: strokeColor,
              fontWeight: 500,
              pointerEvents: "none",
            }}
          >
            {derivedPrefix}
            {data.name}
          </text>
        </g>
      )}

      {/* Source Multiplicity */}
      {isAssociation && sourceMult && (
        <g>
          <text
            x={sourceX + (targetX - sourceX) * 0.12}
            y={sourceY + (targetY - sourceY) * 0.12 - 4}
            textAnchor="start"
            style={{
              fontSize: "9px",
              fontWeight: 500,
              pointerEvents: "none",
            }}
          >
            <tspan
              fill="white"
              fillOpacity={0.88}
              stroke="white"
              strokeWidth={2.5}
              strokeLinejoin="round"
            >
              {sourceMult}
            </tspan>
          </text>
          <text
            x={sourceX + (targetX - sourceX) * 0.12}
            y={sourceY + (targetY - sourceY) * 0.12 - 4}
            textAnchor="start"
            style={{
              fontSize: "9px",
              fill: strokeColor,
              pointerEvents: "none",
            }}
          >
            {sourceMult}
          </text>
        </g>
      )}

      {/* Target Multiplicity */}
      {isAssociation && targetMult && (
        <g>
          <text
            x={sourceX + (targetX - sourceX) * 0.88}
            y={sourceY + (targetY - sourceY) * 0.88 - 4}
            textAnchor="end"
            style={{
              fontSize: "9px",
              fontWeight: 500,
              pointerEvents: "none",
            }}
          >
            <tspan
              fill="white"
              fillOpacity={0.88}
              stroke="white"
              strokeWidth={2.5}
              strokeLinejoin="round"
            >
              {targetMult}
            </tspan>
          </text>
          <text
            x={sourceX + (targetX - sourceX) * 0.88}
            y={sourceY + (targetY - sourceY) * 0.88 - 4}
            textAnchor="end"
            style={{
              fontSize: "9px",
              fill: strokeColor,
              pointerEvents: "none",
            }}
          >
            {targetMult}
          </text>
        </g>
      )}

      {/* Source Role Name */}
      {isAssociation && sourceRole && (
        <text
          x={sourceX + (targetX - sourceX) * 0.12}
          y={sourceY + (targetY - sourceY) * 0.12 + 10}
          textAnchor="start"
          style={{
            fontSize: "9px",
            fill: strokeColor,
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
          x={sourceX + (targetX - sourceX) * 0.88}
          y={sourceY + (targetY - sourceY) * 0.88 + 10}
          textAnchor="end"
          style={{
            fontSize: "9px",
            fill: strokeColor,
            fontStyle: "italic",
            pointerEvents: "none",
          }}
        >
          {targetRole}
        </text>
      )}
    </>
  );
}

export const ClassEdge = memo(ClassEdgeComponent);
