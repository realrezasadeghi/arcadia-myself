"use client";

import { type DragEventHandler, useCallback, useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/modules/shared/ui/components/ui/tooltip";
import { cn } from "@/modules/shared/ui/libs/cn";
import { getClassElementTypeInfo } from "../constants/class-diagram";
import type { ClassElementTypeValue } from "../types/class-diagram";

export type ClassElementShapeListProps = {
  types: ClassElementTypeValue[];
};

const CLASS_ELEMENT_CATEGORIES = [
  {
    label: "UML Elements",
    types: ["CLASS", "INTERFACE", "ENUM"] as ClassElementTypeValue[],
  },
  {
    label: "Data Types",
    types: [
      "DATA_TYPE",
      "PRIMITIVE",
      "COLLECTION",
      "UNION",
    ] as ClassElementTypeValue[],
  },
  {
    label: "Containers",
    types: ["PACKAGE"] as ClassElementTypeValue[],
  },
];

function ClassElementShape({
  type,
  className,
}: {
  type: ClassElementTypeValue;
  className?: string;
}) {
  const info = useMemo(() => getClassElementTypeInfo(type), [type]);
  const isRounded = info.shape === "rounded-rectangle";

  const handleDragStart: DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.dataTransfer.setData("application/element-type", type);
      event.dataTransfer.effectAllowed = "copy";
    },
    [type],
  );

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={cn(
        "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 cursor-grab active:cursor-grabbing",
        "hover:bg-accent/80 hover:shadow-sm transition-all duration-150 select-none",
        className,
      )}
    >
      {/* Shape preview */}
      <div
        className="flex size-7 shrink-0 items-center justify-center border-[1.5px]"
        style={{
          borderRadius: isRounded ? "8px" : "3px",
          borderColor: info.color,
          backgroundColor: `${info.color}0A`,
        }}
      >
        <span
          className="block size-2.5 rounded-sm"
          style={{ backgroundColor: info.color }}
        />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-medium leading-tight truncate">
          {info.label}
        </span>
        <span className="text-[10px] text-muted-foreground leading-tight truncate">
          {info.description}
        </span>
      </div>
    </div>
  );
}

export function ClassElementShapeList({ types }: ClassElementShapeListProps) {
  const groupedTypes = useMemo(() => {
    const typeSet = new Set(types);
    return CLASS_ELEMENT_CATEGORIES.filter((cat) =>
      cat.types.some((t) => typeSet.has(t)),
    ).map((cat) => ({
      ...cat,
      types: cat.types.filter((t) => typeSet.has(t)),
    }));
  }, [types]);

  return (
    <div className="flex flex-col gap-1 p-2">
      {groupedTypes.map((category) => (
        <div key={category.label}>
          <div className="px-2.5 py-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {category.label}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            {category.types.map((type) => (
              <Tooltip key={type}>
                <TooltipTrigger asChild>
                  <ClassElementShape type={type} />
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p className="text-xs">
                    {getClassElementTypeInfo(type).description}
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
