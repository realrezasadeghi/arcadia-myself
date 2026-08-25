"use client";

import { type DragEventHandler, useCallback, useMemo } from "react";
import { cn } from "@/modules/shared/ui/libs/cn";
import { getElementVisual } from "../helpers/element";
import type { ElementTypeValue } from "../types/element";

interface ElementShapeProps {
  label: string;
  type: ElementTypeValue;
  onDragStart?(type: ElementTypeValue): void;
}

export function ElementShape({
  type,
  label,
  className,
  onDragStart,
  ...props
}: ElementShapeProps & React.HTMLAttributes<HTMLDivElement>) {
  const spec = useMemo(() => getElementVisual(type), [type]);

  const borderRadius =
    spec.shape === "ellipse"
      ? "50%"
      : spec.shape === "rounded-rectangle"
        ? "6px"
        : "2px";

  const handleDragStart: DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.dataTransfer.setData("application/element-type", type);
      event.dataTransfer.effectAllowed = "copy";
      onDragStart?.(type);
    },
    [onDragStart, type],
  );

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      onDragStart={handleDragStart}
      {...props}
    >
      <span
        className="size-5 shrink-0 border"
        style={{
          borderRadius,
          borderColor: spec.strokeColor,
          backgroundColor: spec.fillColor,
        }}
      />
      <span className="text-xs leading-tight">{label}</span>
    </div>
  );
}
