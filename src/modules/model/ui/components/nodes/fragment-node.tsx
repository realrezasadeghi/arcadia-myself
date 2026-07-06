"use client";

import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";
import { memo } from "react";
import { cn } from "@/modules/shared/ui/libs/cn";
import type { FragmentNodeData } from "@/modules/model/ui/types/scenario";

type FragmentNodeProps = NodeProps<Node<FragmentNodeData>>;

function FragmentNodeComponent({ data, selected }: FragmentNodeProps) {
  const { fragment, operator, guard, isCombined } = data;

  return (
    <div
      className={cn(
        "relative border-2 rounded-lg bg-background/50 select-none cursor-grab active:cursor-grabbing",
        "min-w-[300px] min-h-[100px] flex flex-col",
        selected && "shadow-[0_0_0_2px_hsl(var(--primary))]",
        isCombined && "border-dashed",
      )}
      style={{
        borderColor: getFragmentColor(fragment.type),
        backgroundColor: `${getFragmentColor(fragment.type)}10`,
        width: fragment.layout.size.width,
        height: fragment.layout.size.height,
      }}
    >
      {/* Operator label */}
      <div
        className="absolute -top-6 left-3 flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded"
        style={{
          backgroundColor: getFragmentColor(fragment.type),
          color: "white",
        }}
      >
        <span>{operator}</span>
        {guard && (
          <>
            <span className="text-[8px]">[</span>
            <span className="text-[8px]">{guard}</span>
            <span className="text-[8px]">]</span>
          </>
        )}
      </div>

      {/* Content area */}
      <div className="flex-1 p-3 relative">
        <div className="absolute inset-0 border-dashed border-current/20 rounded" />
        
        {/* Child fragments indicator */}
        {fragment.childFragmentIds.length > 0 && (
          <div className="absolute top-2 right-2 text-[9px] text-muted-foreground">
            {fragment.childFragmentIds.length} fragment(s)
          </div>
        )}

        {/* Messages indicator */}
        {fragment.messageIds.length > 0 && (
          <div className="absolute bottom-2 right-2 text-[9px] text-muted-foreground">
            {fragment.messageIds.length} message(s)
          </div>
        )}
      </div>

      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="size-2! border! border-current! bg-background!"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="size-2! border! border-current! bg-background!"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="size-2! border! border-current! bg-background!"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="size-2! border! border-current! bg-background!"
      />
    </div>
  );
}

export const FragmentNode = memo(FragmentNodeComponent);

function getFragmentColor(type: import("@/modules/model/domain/value-objects/fragment-type").FragmentType): string {
  const colors: Record<string, string> = {
    alt: "#E74C3C",
    opt: "#F39C12",
    loop: "#3498DB",
    break: "#E67E22",
    par: "#9B59B6",
    critical: "#C0392B",
    region: "#7F8C8D",
    neg: "#E74C3C",
    assert: "#27AE60",
    ignore: "#95A5A6",
    consider: "#3498DB",
  };
  return colors[type.value] || "#94A3B8";
}