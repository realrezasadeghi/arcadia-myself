"use client";

import { Spline } from "lucide-react";
import {
  CLASS_RELATIONSHIP_TYPES,
  getClassRelationshipTypeInfo,
} from "../constants/class-diagram";
import type { ClassRelationshipTypeValue } from "../types/class-diagram";

export function ClassRelationshipList() {
  return (
    <>
      <div className="px-3 pt-1">
        <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <Spline className="size-3" />
          Relationships
        </p>
      </div>
      <div className="flex flex-col gap-1 p-2">
        {CLASS_RELATIONSHIP_TYPES.map((rel) => (
          <ClassRelationshipItem key={rel.value} type={rel.value} />
        ))}
      </div>
    </>
  );
}

function ClassRelationshipItem({ type }: { type: ClassRelationshipTypeValue }) {
  const info = getClassRelationshipTypeInfo(type);

  const renderLine = () => {
    const sw = info.strokeWidth;
    const color = info.strokeColor;

    if (type === "GENERALIZATION") {
      return (
        <svg width="20" height="10" viewBox="0 0 20 10" className="shrink-0">
          <line x1="1" y1="5" x2="15" y2="5" stroke={color} strokeWidth={sw} />
          <polygon
            points="15,1 19,5 15,9"
            fill="none"
            stroke={color}
            strokeWidth={sw}
          />
        </svg>
      );
    }

    if (type === "REALIZATION") {
      return (
        <svg width="20" height="10" viewBox="0 0 20 10" className="shrink-0">
          <line
            x1="1"
            y1="5"
            x2="15"
            y2="5"
            stroke={color}
            strokeWidth={sw}
            strokeDasharray="4,2"
          />
          <polygon
            points="15,1 19,5 15,9"
            fill="none"
            stroke={color}
            strokeWidth={sw}
          />
        </svg>
      );
    }

    if (type === "DEPENDENCY") {
      return (
        <svg width="20" height="10" viewBox="0 0 20 10" className="shrink-0">
          <line
            x1="1"
            y1="5"
            x2="15"
            y2="5"
            stroke={color}
            strokeWidth={sw}
            strokeDasharray="3,2"
          />
          <polygon
            points="14,2 18,5 14,8"
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
        </svg>
      );
    }

    // ASSOCIATION — solid line
    return (
      <svg width="20" height="10" viewBox="0 0 20 10" className="shrink-0">
        <line x1="1" y1="5" x2="19" y2="5" stroke={color} strokeWidth={sw} />
      </svg>
    );
  };

  return (
    <div
      className="flex items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-accent/80 hover:shadow-sm transition-all duration-150 cursor-grab active:cursor-grabbing select-none"
      title={`${info.label} — drag between node handles to create`}
    >
      {renderLine()}
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-medium leading-tight">{info.label}</span>
        <span className="text-[10px] text-muted-foreground leading-tight truncate">
          {info.description}
        </span>
      </div>
    </div>
  );
}
