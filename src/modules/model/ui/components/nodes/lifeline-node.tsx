"use client";

import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";
import { memo, useCallback } from "react";
import { cn } from "@/modules/shared/ui/libs/cn";
import type { LifelineNodeData } from "@/modules/model/ui/types/scenario";

type LifelineNodeProps = NodeProps<Node<LifelineNodeData>>;

function LifelineNodeComponent({ data, selected }: LifelineNodeProps) {
  const { lifeline, elementName, elementType, selector, decomposed } = data;

  const handleDragStart: React.DragEventHandler = useCallback(
    (e) => {
      e.dataTransfer.setData(
        "application/scenario-node",
        JSON.stringify({
          lifelineId: lifeline.id,
          elementId: lifeline.elementId,
          elementType: elementType,
          name: elementName,
        }),
      );
      e.dataTransfer.effectAllowed = "copy";
    },
    [data],
  );

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={cn(
        "relative flex flex-col items-center gap-0.5 border-2 bg-background select-none cursor-grab active:cursor-grabbing",
        "min-w-[120px] h-full min-h-[600px]",
        selected && "shadow-[0_0_0_2px_hsl(var(--primary))]",
        decomposed && "opacity-60",
      )}
      style={{
        borderColor: getLifelineColor(lifeline.type),
        width: lifeline.layout.size.width,
      }}
    >
      {/* Head */}
      <div
        className="absolute -top-[40px] left-0 right-0 flex items-center justify-center gap-1"
        style={{ height: 40 }}
      >
        <span
          className="text-[9px] text-muted-foreground uppercase tracking-wide"
          style={{ color: getLifelineColor(lifeline.type) }}
        >
          {lifeline.type.labelFa || lifeline.type.label}
        </span>
        <div
          className="relative flex items-center justify-center"
          style={{
            width: 24,
            height: 24,
            backgroundColor: getLifelineColor(lifeline.type),
            borderRadius: "50%",
            border: "2px solid hsl(var(--background))",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* Lifeline (vertical line) */}
      <div
        className="flex-1 w-px relative"
        style={{
          backgroundColor: getLifelineColor(lifeline.type),
          height: "100%",
        }}
      >
        {/* Activation bars would go here */}
      </div>

      {/* Footer with name */}
      <div className="absolute bottom-0 left-0 right-0 px-2 pb-2 text-center">
        <span
          className="line-clamp-2 text-[11px] font-medium leading-tight"
          style={{ color: getLifelineColor(lifeline.type) }}
        >
          {elementName}
        </span>
        {selector && (
          <span className="text-[9px] text-muted-foreground block truncate">
            [{selector}]
          </span>
        )}
      </div>

      {/* Connection handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="size-2! border! border-current! bg-background!"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="size-2! border! border-current! bg-background!"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      />
    </div>
  );
}

export const LifelineNode = memo(LifelineNodeComponent);

function getLifelineColor(type: import("@/modules/model/domain/value-objects/lifeline-type").LifelineType): string {
  const colors: Record<string, string> = {
    actor: "#1E8449",
    entity: "#2E86C1",
    component: "#1A5276",
    function: "#D4AC0D",
    boundary: "#7D3C98",
    control: "#6C3483",
    database: "#2C3E50",
    gate: "#7F8C8D",
  };
  return colors[type.value] || "#94A3B8";
}