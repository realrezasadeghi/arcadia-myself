"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/modules/shared/ui/components/ui/tooltip";
import { useMemo } from "react";
import { getElementTypesForLayer } from "../helpers/element";
import type { LayerValue } from "../types/layer";
import { ElementShape } from "./element-shape";

export type ElementShapeListProps = {
  layer: LayerValue;
};

export function ElementShapeList({ layer }: ElementShapeListProps) {
  const elementTypes = useMemo(() => getElementTypesForLayer(layer), [layer]);

  return (
    <div className="flex flex-col gap-1 p-2">
      {elementTypes.map((element) => {
        return (
          <Tooltip key={element.value}>
            <TooltipTrigger asChild>
              <ElementShape
                draggable
                type={element.value}
                label={element.labelFa}
                className="rounded-md px-2.5 py-1.5 cursor-grab active:cursor-grabbing hover:bg-accent transition-colors select-none"
              />
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              <p className="font-medium">{element.label}</p>
              <p className="text-muted-foreground">{element.labelFa}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
