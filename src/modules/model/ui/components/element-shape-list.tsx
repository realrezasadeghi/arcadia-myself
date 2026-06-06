"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/modules/shared/ui/components/ui/tooltip";
import { useMemo } from "react";
import {
  getElementTypeInfo,
  getElementTypesForLayer,
} from "../helpers/element";
import type { ElementTypeValue } from "../types/element";
import type { LayerValue } from "../types/layer";
import { ElementShape } from "./element-shape";

export type ElementShapeListProps = {
  layer: LayerValue;
  /** اگر داده شود، فقط همین نوع‌ها نمایش داده می‌شوند (پالت مخصوص نوع دیاگرام). */
  types?: ElementTypeValue[];
};

export function ElementShapeList({ layer, types }: ElementShapeListProps) {
  const elementTypes = useMemo(
    () =>
      types
        ? types.map((value) => getElementTypeInfo(value))
        : getElementTypesForLayer(layer),
    [layer, types],
  );

  return (
    <div className="flex flex-col gap-1 p-2">
      {elementTypes.map((element) => {
        return (
          <Tooltip key={element.value}>
            <TooltipTrigger asChild>
              <ElementShape
                draggable
                type={element.value}
                label={element.label}
                className="rounded-md px-2.5 py-1.5 cursor-grab active:cursor-grabbing hover:bg-accent transition-colors select-none"
              />
            </TooltipTrigger>
          </Tooltip>
        );
      })}
    </div>
  );
}
