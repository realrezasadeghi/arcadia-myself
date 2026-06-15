"use client";

import { useReactFlow } from "@xyflow/react";
import { Map as MapIcon } from "lucide-react";
import { type KeyboardEvent, type MouseEvent, useMemo } from "react";
import { getElementVisual } from "../../helpers/element";
import { useCanvasStore } from "../../stores/canvas";

const PADDING = 40;

/**
 * OutlinePanel
 *
 * نمای کلی فقط‌خواندنی از دیاگرام فعال (مشابه Outline در Capella).
 * یک MiniMap استاندارد React Flow باید فرزند <ReactFlow> باشد، بنابراین اینجا
 * یک نمای SVG سفارشی از روی canvas store می‌سازیم. کلیک روی نما،
 * viewport canvas اصلی را روی همان نقطه مرکز می‌کند.
 */
export function OutlinePanel() {
  const nodes = useCanvasStore((s) => s.nodes);
  const { setCenter } = useReactFlow();

  const bounds = useMemo(() => {
    if (nodes.length === 0) return null;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const n of nodes) {
      const w = n.width ?? 160;
      const h = n.height ?? 60;
      minX = Math.min(minX, n.position.x);
      minY = Math.min(minY, n.position.y);
      maxX = Math.max(maxX, n.position.x + w);
      maxY = Math.max(maxY, n.position.y + h);
    }
    return {
      x: minX - PADDING,
      y: minY - PADDING,
      width: maxX - minX + PADDING * 2,
      height: maxY - minY + PADDING * 2,
    };
  }, [nodes]);

  const handleClick = (e: MouseEvent<SVGSVGElement>) => {
    if (!bounds) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratioX = (e.clientX - rect.left) / rect.width;
    const ratioY = (e.clientY - rect.top) / rect.height;
    const flowX = bounds.x + ratioX * bounds.width;
    const flowY = bounds.y + ratioY * bounds.height;
    setCenter(flowX, flowY, { duration: 300 });
  };

  const handleKeyDown = (e: KeyboardEvent<SVGSVGElement>) => {
    if (!bounds) return;
    // Enter/Space → recenter on the diagram center
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setCenter(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2, {
        duration: 300,
      });
    }
  };

  return (
    <aside className="flex h-full min-h-0 flex-col border-l bg-card">
      <div className="flex h-8 shrink-0 items-center gap-1.5 border-b bg-muted/30 px-3">
        <MapIcon className="size-3.5 text-muted-foreground" />
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Outline
        </p>
      </div>

      <div className="min-h-0 flex-1 p-2">
        {!bounds ? (
          <div className="flex h-full items-center justify-center text-center">
            <p className="text-[11px] text-muted-foreground">
              No diagram content to outline
            </p>
          </div>
        ) : (
            <svg
            role="button"
            tabIndex={0}
            aria-label="Diagram outline — click to recenter"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            viewBox={`${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`}
            className="h-full w-full cursor-pointer rounded-md border border-border bg-muted/20"
            preserveAspectRatio="xMidYMid meet"
          >
            {nodes.map((n) => {
              const visual = getElementVisual(n.data.elementType);
              const w = n.width ?? 160;
              const h = n.height ?? 60;
              const isEllipse = visual.shape === "ellipse";
              return isEllipse ? (
                <ellipse
                  key={n.id}
                  cx={n.position.x + w / 2}
                  cy={n.position.y + h / 2}
                  rx={w / 2}
                  ry={h / 2}
                  fill={visual.fillColor}
                  stroke={visual.strokeColor}
                  strokeWidth={2}
                />
              ) : (
                <rect
                  key={n.id}
                  x={n.position.x}
                  y={n.position.y}
                  width={w}
                  height={h}
                  rx={visual.shape === "rounded-rectangle" ? 8 : 2}
                  fill={visual.fillColor}
                  stroke={visual.strokeColor}
                  strokeWidth={2}
                />
              );
            })}
          </svg>
        )}
      </div>
    </aside>
  );
}
