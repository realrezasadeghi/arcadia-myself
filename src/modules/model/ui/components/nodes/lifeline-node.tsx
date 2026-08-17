"use client";

import { Handle, Position } from "@xyflow/react";

type LifelineNodeProps = {
  data: {
    name: string;
    representedElementType: string;
    columnIndex: number;
    scenarioId: string;
    lifelineId: string;
  };
  selected?: boolean;
};

export function LifelineNode({ data, selected }: LifelineNodeProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          px-4 py-2 rounded-t-lg border-2 bg-card text-card-foreground
          font-medium text-sm min-w-[120px] text-center
          ${selected ? "border-primary ring-2 ring-primary/20" : "border-border"}
        `}
      >
        {data.name}
      </div>
      <div className="w-0.5 bg-border/60 flex-1 min-h-[400px]" />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-primary border-2 border-primary-foreground"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-primary border-2 border-primary-foreground"
      />
    </div>
  );
}
