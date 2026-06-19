import { cn } from "@/modules/shared/ui/libs/cn";
import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";
import { memo } from "react";
import { getElementTypeInfo, getElementVisual } from "../../helpers/element";
import type { ElementNodeData } from "../../stores/canvas";

type ComponentNodeType = Node<ElementNodeData>;

/**
 * ComponentNode — سبک Capella/UML
 * مستطیل اصلی با دو مستطیل کوچک هم‌پوشان روی ضلع چپ (نماد component).
 */
function ComponentNodeComponent({
  data,
  selected,
}: NodeProps<ComponentNodeType>) {
  const typeInfo = getElementTypeInfo(data.elementType);
  const spec = getElementVisual(data.elementType);

  return (
    <div
      className={cn(
        "relative flex min-h-14 min-w-40 items-center justify-center border-2 px-5 py-2.5 text-center select-none",
        selected && "shadow-[0_0_0_2px_hsl(var(--primary))]",
        data.status === "DEPRECATED" && "opacity-60",
      )}
      style={{
        backgroundColor: spec.fillColor,
        borderColor: spec.strokeColor,
        color: spec.strokeColor,
      }}
    >
      <span className="absolute -top-4 right-0 left-0 truncate px-1 text-center text-[9px] text-muted-foreground">
        {typeInfo.label}
      </span>

      {/* دو مستطیل هم‌پوشان نماد مؤلفه */}
      <div className="absolute -left-1.5 top-2.5 flex flex-col gap-1">
        <span
          className="h-2 w-3 border bg-background"
          style={{ borderColor: spec.strokeColor }}
        />
        <span
          className="h-2 w-3 border bg-background"
          style={{ borderColor: spec.strokeColor }}
        />
      </div>

      <span className="line-clamp-2 ps-2 text-[11px] font-medium leading-tight wrap-break-word">
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

export const ComponentNode = memo(ComponentNodeComponent);
