import { cn } from "@/modules/shared/ui/libs/cn";
import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";
import { type DragEventHandler, memo, useCallback } from "react";
import { getElementTypeInfo, getElementVisual } from "../helpers/element";
import type { ElementNodeData } from "../stores/canvas";

const STATUS_RING: Record<string, string> = {
  DRAFT: "ring-1 ring-gray-400/50",
  VALIDATED: "ring-2 ring-green-500/70",
  DEPRECATED: "ring-2 ring-red-400/70 opacity-60",
};

type ArchitectureNodeData = Node<ElementNodeData>;

function ArchitectureNodeComponent({
  data,
  selected,
}: NodeProps<ArchitectureNodeData>) {
  const elementType = getElementTypeInfo(data.elementType);
  const spec = getElementVisual(elementType.value);

  const isEllipse = spec.shape === "ellipse";
  const isRounded = spec.shape === "rounded-rectangle";

  const handleDragStart: DragEventHandler = useCallback(
    (e) => {
      e.dataTransfer.setData(
        "application/canvas-node",
        JSON.stringify({
          elementId: data.elementId,
          elementType: data.elementType,
          name: data.name,
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
        "relative flex items-center justify-center min-w-35 min-h-13 px-3 py-2",
        "border-2 text-[11px] font-medium leading-tight text-center select-none",
        "transition-shadow duration-150 cursor-grab active:cursor-grabbing",
        isEllipse ? "rounded-full" : isRounded ? "rounded-xl" : "rounded-sm",
        selected && "shadow-[0_0_0_2px_hsl(var(--primary))]",
        STATUS_RING[data.status] ?? "",
      )}
      style={{
        backgroundColor: spec.fillColor,
        borderColor: spec.strokeColor,
        color: spec.strokeColor,
      }}
    >
      {data.status === "VALIDATED" && (
        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
      )}
      {data.status === "DEPRECATED" && (
        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-400 border-2 border-background" />
      )}

      <span className="absolute -top-4 right-0 left-0 text-center text-[9px] text-muted-foreground truncate px-1">
        {elementType.label}
      </span>

      <span className="line-clamp-2 wrap-break-word">{data.name}</span>

      <Handle
        type="target"
        position={Position.Top}
        className="size-2! border! border-current! bg-background!"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="size-2! border! border-current! bg-background!"
      />
      <Handle
        type="target"
        position={Position.Right}
        className="size-2! border! border-current! bg-background!"
      />
      <Handle
        type="source"
        position={Position.Left}
        className="size-2! border! border-current! bg-background!"
      />
    </div>
  );
}

export const ArchitectureNode = memo(ArchitectureNodeComponent);
