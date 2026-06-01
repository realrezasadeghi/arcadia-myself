"use client";

import { useCallback, useMemo } from "react";
import { Card } from "@/modules/shared/ui/components/ui/card";
import { Badge } from "@/modules/shared/ui/components/ui/badge";
import { Skeleton } from "@/modules/shared/ui/components/ui/skeleton";

export interface LayerElement {
  id: string;
  name: string;
  type: string;
  status: string;
}

export interface TraceConnection {
  id: string;
  sourceElementId: string;
  sourceLayer: string;
  targetElementId: string;
  targetLayer: string;
  type: "Realization" | "Allocation" | "Deployment";
  description?: string;
}

interface TraceLayersViewProps {
  layers: Record<string, LayerElement[]>;
  traceLinks: TraceConnection[];
  isLoading?: boolean;
}

const LAYER_ORDER = { OA: 0, SA: 1, LA: 2, PA: 3 };
const LAYER_LABELS = { OA: "تحلیل عملیاتی", SA: "تحلیل سیستم", LA: "معماری منطقی", PA: "معماری فیزیکی" };
const TRACE_COLORS: Record<string, { line: string; bg: string }> = {
  Realization: { line: "#3b82f6", bg: "bg-blue-50" },
  Allocation: { line: "#10b981", bg: "bg-green-50" },
  Deployment: { line: "#8b5cf6", bg: "bg-purple-50" },
};

export function TraceLayersView({ layers, traceLinks, isLoading = false }: TraceLayersViewProps) {
  const sortedLayers = useMemo(() => {
    return (Object.keys(layers) as Array<keyof typeof layers>)
      .sort((a, b) => LAYER_ORDER[a] - LAYER_ORDER[b]);
  }, [layers]);

  const elementPositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number; layerIndex: number }> = {};
    const LAYER_WIDTH = 300;
    const ELEMENT_HEIGHT = 70;
    const GAP = 20;

    sortedLayers.forEach((layer, layerIndex) => {
      const layerElements = layers[layer] || [];
      const startY = 80;

      layerElements.forEach((element, index) => {
        positions[`${layer}-${element.id}`] = {
          x: layerIndex * LAYER_WIDTH + 50,
          y: startY + index * (ELEMENT_HEIGHT + GAP),
          layerIndex,
        };
      });
    });

    return positions;
  }, [layers, sortedLayers]);

  const canvasHeight = useMemo(() => {
    const maxElements = Math.max(...sortedLayers.map(l => (layers[l] || []).length));
    return Math.max(500, 80 + maxElements * 90);
  }, [sortedLayers, layers]);

  const canvasWidth = useMemo(() => {
    return sortedLayers.length * 300 + 100;
  }, [sortedLayers]);

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <div className="grid grid-cols-4 gap-4">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-8 w-24" />
              {[0, 1, 2].map(j => (
                <Skeleton key={j} className="h-20 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {/* Legend */}
      <div className="flex gap-6 pb-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-6 h-1" style={{ backgroundColor: TRACE_COLORS.Realization.line }} />
          <span className="text-sm text-muted-foreground">تحقق (Realization)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-1" style={{ backgroundColor: TRACE_COLORS.Allocation.line }} />
          <span className="text-sm text-muted-foreground">اختصاص (Allocation)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-1" style={{ backgroundColor: TRACE_COLORS.Deployment.line }} />
          <span className="text-sm text-muted-foreground">استقرار (Deployment)</span>
        </div>
      </div>

      {/* Layers Visualization */}
      <div className="overflow-x-auto border rounded-lg bg-card">
        <svg width={canvasWidth} height={canvasHeight} className="min-w-full">
          {/* Draw trace links */}
          {traceLinks.map(trace => {
            const sourceKey = `${trace.sourceLayer}-${trace.sourceElementId}`;
            const targetKey = `${trace.targetLayer}-${trace.targetElementId}`;
            const sourcePos = elementPositions[sourceKey];
            const targetPos = elementPositions[targetKey];

            if (!sourcePos || !targetPos) return null;

            const x1 = sourcePos.x + 150;
            const y1 = sourcePos.y + 35;
            const x2 = targetPos.x + 150;
            const y2 = targetPos.y + 35;

            const color = TRACE_COLORS[trace.type]?.line || "#94a3b8";

            return (
              <g key={trace.id}>
                <path
                  d={`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2} ${x2} ${y2}`}
                  stroke={color}
                  strokeWidth="2"
                  fill="none"
                  opacity="0.6"
                  strokeDasharray={trace.type === "Allocation" ? "5,5" : "0"}
                />
                {/* Arrow head */}
                <polygon
                  points={`${x2},${y2} ${x2 - 8},${y2 - 5} ${x2 - 8},${y2 + 5}`}
                  fill={color}
                  opacity="0.6"
                />
              </g>
            );
          })}

          {/* Draw elements */}
          {sortedLayers.map(layer => {
            const layerElements = layers[layer] || [];
            return layerElements.map(element => {
              const key = `${layer}-${element.id}`;
              const pos = elementPositions[key];
              if (!pos) return null;

              return (
                <g key={key}>
                  {/* Element box */}
                  <rect
                    x={pos.x}
                    y={pos.y}
                    width="150"
                    height="60"
                    fill="white"
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                    rx="4"
                  />

                  {/* Text */}
                  <text
                    x={pos.x + 75}
                    y={pos.y + 35}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="bold"
                    fill="#1e293b"
                  >
                    <tspan x={pos.x + 75} dy="0">
                      {element.name.length > 15 ? element.name.slice(0, 15) + "..." : element.name}
                    </tspan>
                  </text>
                </g>
              );
            });
          })}
        </svg>
      </div>

      {/* Layers Grid */}
      <div className="grid grid-cols-4 gap-4">
        {sortedLayers.map(layer => (
          <div key={layer}>
            <div className="mb-3">
              <h3 className="font-semibold text-sm">{LAYER_LABELS[layer]}</h3>
              <p className="text-xs text-muted-foreground">{layer}</p>
            </div>

            <div className="space-y-2">
              {(layers[layer] || []).map(element => (
                <Card key={element.id} className="p-3">
                  <div className="text-sm font-medium line-clamp-2">{element.name}</div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">{element.type}</Badge>
                    <Badge
                      variant={element.status === "VALIDATED" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {element.status === "VALIDATED" ? "✓ معتبر" : "پیش نویس"}
                    </Badge>
                  </div>
                </Card>
              ))}

              {(!layers[layer] || layers[layer].length === 0) && (
                <div className="text-xs text-muted-foreground text-center py-8">
                  هیچ عنصری نیست
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
