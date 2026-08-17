"use client";

import { X } from "lucide-react";

type FragmentOverlayProps = {
  id: string;
  name: string;
  operator: string;
  guard: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onRemove?: (id: string) => void;
};

const OPERATOR_COLORS: Record<
  string,
  { border: string; bg: string; text: string }
> = {
  alt: {
    border: "border-blue-500",
    bg: "bg-blue-500/5",
    text: "text-blue-600",
  },
  opt: {
    border: "border-green-500",
    bg: "bg-green-500/5",
    text: "text-green-600",
  },
  loop: {
    border: "border-orange-500",
    bg: "bg-orange-500/5",
    text: "text-orange-600",
  },
  break: { border: "border-red-500", bg: "bg-red-500/5", text: "text-red-600" },
  par: {
    border: "border-purple-500",
    bg: "bg-purple-500/5",
    text: "text-purple-600",
  },
  critical: {
    border: "border-yellow-500",
    bg: "bg-yellow-500/5",
    text: "text-yellow-600",
  },
  assert: {
    border: "border-cyan-500",
    bg: "bg-cyan-500/5",
    text: "text-cyan-600",
  },
  neg: {
    border: "border-pink-500",
    bg: "bg-pink-500/5",
    text: "text-pink-600",
  },
  ignore: {
    border: "border-gray-400",
    bg: "bg-gray-400/5",
    text: "text-gray-500",
  },
  consider: {
    border: "border-gray-400",
    bg: "bg-gray-400/5",
    text: "text-gray-500",
  },
  strict: {
    border: "border-indigo-500",
    bg: "bg-indigo-500/5",
    text: "text-indigo-600",
  },
  seq: {
    border: "border-teal-500",
    bg: "bg-teal-500/5",
    text: "text-teal-600",
  },
};

export function FragmentOverlay({
  id,
  name,
  operator,
  guard,
  x,
  y,
  width,
  height,
  isSelected,
  onSelect,
  onRemove,
}: FragmentOverlayProps) {
  const colors = OPERATOR_COLORS[operator] ?? OPERATOR_COLORS.alt;

  return (
    <div
      className={`absolute rounded-sm border-2 ${colors.border} ${colors.bg} ${
        isSelected ? "ring-2 ring-primary/30" : ""
      }`}
      style={{
        left: x,
        top: y,
        width,
        height,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(id);
      }}
    >
      {/* Header label */}
      <div
        className={`flex items-center justify-between px-2 py-0.5 text-xs font-mono font-bold ${colors.text} bg-background/80 border-b ${colors.border}`}
      >
        <span className="uppercase">{operator}</span>
        {guard && (
          <span className="text-muted-foreground font-normal ml-2">
            [{guard}]
          </span>
        )}
        {isSelected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.(id);
            }}
            className="ml-2 text-muted-foreground hover:text-destructive"
          >
            <X className="size-3" />
          </button>
        )}
      </div>
    </div>
  );
}
