import { cn } from "@/modules/shared/ui/libs/cn";
import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";
import { memo } from "react";
import { getElementTypeInfo, getElementVisual } from "../../helpers/element";
import type { ElementNodeData } from "../../stores/canvas";

type FunctionNodeType = Node<ElementNodeData>;

/**
 * FunctionNode — سبک Capella
 * مستطیل گردگوشه با نوار عنوان رنگی و پورت‌های ورودی/خروجی روی اضلاع
 * (برای نمایش dataflow).
 */
function FunctionNodeComponent({ data, selected }: NodeProps<FunctionNodeType>) {
  const typeInfo = getElementTypeInfo(data.elementType);
  const spec = getElementVisual(data.elementType);

  return (
    <div
      className={cn(
        "relative min-w-36 overflow-hidden rounded-lg border-2 bg-background select-none",
        selected && "shadow-[0_0_0_2px_hsl(var(--primary))]",
        data.status === "DEPRECATED" && "opacity-60",
      )}
      style={{ borderColor: spec.strokeColor }}
    >
      {/* نوار عنوان رنگی */}
      <div
        className="px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-white/95"
        style={{ backgroundColor: spec.strokeColor }}
      >
        {typeInfo.label}
      </div>

      <div
        className="px-3 py-2.5 text-center text-[11px] font-medium leading-tight"
        style={{ backgroundColor: spec.fillColor, color: spec.strokeColor }}
      >
        <span className="line-clamp-2 wrap-break-word">{data.name}</span>
      </div>

      {/* پورت‌های ورودی (چپ) و خروجی (راست) */}
      <Handle
        id="in"
        type="target"
        position={Position.Left}
        className="size-2.5! rounded-none! border! border-current! bg-background!"
        style={{ top: "60%" }}
      />
      <Handle
        id="out"
        type="source"
        position={Position.Right}
        className="size-2.5! rounded-none! border! border-current! bg-background!"
        style={{ top: "60%" }}
      />
      <Handle type="target" position={Position.Top} className="size-2! border! border-current! bg-background!" />
      <Handle type="source" position={Position.Bottom} className="size-2! border! border-current! bg-background!" />
    </div>
  );
}

export const FunctionNode = memo(FunctionNodeComponent);
