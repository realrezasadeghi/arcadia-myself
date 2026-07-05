import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";
import { memo } from "react";
import { cn } from "@/modules/shared/ui/libs/cn";
import type { ClassNodeData } from "../../../infrastructure/projections/node-mappers/class-node.mapper";

type ClassNodeType = Node<ClassNodeData>;

const STEREOTYPE_COLORS: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  class: { bg: "#D6EAF8", border: "#2874A6", text: "#1A5276" },
  interface: { bg: "#E8DAEF", border: "#7D3C98", text: "#6C3483" },
  dataType: { bg: "#D5F5E3", border: "#1E8449", text: "#145A32" },
  enumeration: { bg: "#FCF3CF", border: "#D4AC0D", text: "#7D6608" },
  primitiveType: { bg: "#FDEBD0", border: "#E67E22", text: "#935116" },
  collection: { bg: "#FADBD8", border: "#E74C3C", text: "#922B21" },
  exchangeItem: { bg: "#D5D8DC", border: "#717D7E", text: "#2C3E50" },
};

function ClassNodeComponent({ data, selected }: NodeProps<ClassNodeType>) {
  const colors = STEREOTYPE_COLORS[data.stereotype] ?? STEREOTYPE_COLORS.class;

  return (
    <div
      className={cn(
        "min-w-[200px] border-2 text-[11px] select-none cursor-grab active:cursor-grabbing",
        "transition-shadow duration-150",
        selected && "shadow-[0_0_0_2px_hsl(var(--primary))]",
      )}
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text,
      }}
    >
      {/* Header: stereotype + name */}
      <div
        className="px-3 py-2 text-center border-b"
        style={{ borderColor: colors.border }}
      >
        {data.stereotype !== "class" && (
          <div className="text-[9px] italic opacity-70">
            &lt;&lt;{data.stereotype}&gt;&gt;
          </div>
        )}
        <div
          className={cn(
            "text-[12px] font-bold leading-tight",
            data.isAbstract && "italic",
          )}
        >
          {data.name}
        </div>
      </div>

      {/* Attributes section */}
      {data.attributes.length > 0 && (
        <div
          className="px-3 py-1.5 text-left border-b"
          style={{ borderColor: colors.border }}
        >
          {data.attributes.map((attr) => (
            <div
              key={attr}
              className="text-[10px] leading-snug whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {attr}
            </div>
          ))}
        </div>
      )}

      {/* Operations section */}
      {data.operations.length > 0 && (
        <div className="px-3 py-1.5 text-left">
          {data.operations.map((op) => (
            <div
              key={op}
              className="text-[10px] leading-snug whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {op}
            </div>
          ))}
        </div>
      )}

      {/* Handles */}
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

export const ClassNode = memo(ClassNodeComponent);
