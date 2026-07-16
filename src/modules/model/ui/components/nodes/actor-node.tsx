import { cn } from "@/modules/shared/ui/libs/cn";
import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";
import { type DragEventHandler, memo, useCallback } from "react";
import { getElementTypeInfo, getElementVisual } from "../../helpers/element";
import type { ElementNodeData } from "../../stores/canvas";

type ActorNodeType = Node<ElementNodeData>;

/**
 * ActorNode — سبک Capella
 * فیگور انسانی (دایره سر + بدن) در بالا و برچسب نام در پایین.
 */
function ActorNodeComponent({ data, selected }: NodeProps<ActorNodeType>) {
  const typeInfo = getElementTypeInfo(data.elementType);
  const spec = getElementVisual(data.elementType);

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
        "relative flex min-w-28 flex-col items-center gap-1 rounded-md border-2 bg-background px-3 py-2 select-none cursor-grab active:cursor-grabbing",
        selected && "shadow-[0_0_0_2px_hsl(var(--primary))]",
        data.status === "DEPRECATED" && "opacity-60",
      )}
      style={{ borderColor: spec.strokeColor }}
    >
      <span className="absolute -top-4 right-0 left-0 truncate px-1 text-center text-[9px] text-muted-foreground">
        {typeInfo.label}
      </span>

      {/* فیگور انسانی ساده */}
      <svg
        width="22"
        height="26"
        viewBox="0 0 22 26"
        aria-hidden="true"
        role="presentation"
        style={{ color: spec.strokeColor }}
      >
        <circle
          cx="11"
          cy="5"
          r="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <line
          x1="11"
          y1="9"
          x2="11"
          y2="17"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <line
          x1="4"
          y1="12"
          x2="18"
          y2="12"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <line
          x1="11"
          y1="17"
          x2="5"
          y2="24"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <line
          x1="11"
          y1="17"
          x2="17"
          y2="24"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>

      <span
        className="line-clamp-2 text-center text-[11px] font-medium leading-tight"
        style={{ color: spec.strokeColor }}
      >
        {data.name}
      </span>

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
        position={Position.Left}
        className="size-2! border! border-current! bg-background!"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="size-2! border! border-current! bg-background!"
      />
    </div>
  );
}

export const ActorNode = memo(ActorNodeComponent);
