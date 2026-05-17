"use client";

import { cn } from "@/modules/shared/ui/libs/cn";
import { useMemo } from "react";
import { getElementVisual } from "../helpers/element";
import type { ElementTypeValue } from "../types/element";

interface ElementShapeProps {
  label: string;
  type: ElementTypeValue;
}

export function ElementShape({
  type,
  label,
  ...props
}: ElementShapeProps & React.HTMLAttributes<HTMLDivElement>) {
  const spec = useMemo(() => getElementVisual(type), [type]);

  const borderRadius =
    spec.shape === "ellipse"
      ? "50%"
      : spec.shape === "rounded-rectangle"
        ? "6px"
        : "2px";

  return (
    <div className={cn("flex items-center gap-2.5 rounded-md px-2.5 py-1.5 cursor-grab active:cursor-grabbing hover:bg-accent transition-colors select-none")}>
      <span
        className="size-5 shrink-0 border"
        style={{
          borderRadius,
          borderColor: spec.strokeColor,
          backgroundColor: spec.fillColor,
        }}
        {...props}
      />
      <span className="text-xs leading-tight">{label}</span>
    </div>
  );
}
