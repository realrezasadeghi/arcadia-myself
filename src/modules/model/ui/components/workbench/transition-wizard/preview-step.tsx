"use client";

import type { LucideIcon } from "lucide-react";
import { LAYER_HEX_COLORS } from "../../../constants/layer";
import { getElementTypeInfo, getElementVisual } from "../../../helpers/element";
import { getLayerInfo } from "../../../helpers/layer";
import type { Element, ElementTypeValue } from "../../../types/element";
import type { LayerValue } from "../../../types/layer";
import type { RowState } from "./use-transition-wizard";

export function LayerChip({ layer }: { layer: LayerValue }) {
  const info = getLayerInfo(layer);
  const color = LAYER_HEX_COLORS[layer];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium"
      style={{ borderColor: color, color }}
    >
      <span
        className="size-2.5 rounded-sm"
        style={{ backgroundColor: color }}
      />
      {info.label}
      <span className="opacity-60">({layer})</span>
    </span>
  );
}

export function ShapeChip({
  type,
  size = 16,
}: {
  type: ElementTypeValue;
  size?: number;
}) {
  const spec = getElementVisual(type);
  const radius =
    spec.shape === "ellipse"
      ? "50%"
      : spec.shape === "rounded-rectangle"
        ? "5px"
        : "2px";
  return (
    <span
      className="shrink-0 border"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        borderColor: spec.strokeColor,
        backgroundColor: spec.fillColor,
      }}
    />
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-card p-2.5">
      <Icon className="size-4 text-primary" />
      <span className="text-lg font-semibold leading-none">{value}</span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}

export function PreviewGroup({
  title,
  elements,
  rows,
}: {
  title: string;
  elements: Element[];
  rows: Record<string, RowState>;
}) {
  if (elements.length === 0) return null;
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title} ({elements.length})
      </p>
      <div className="flex flex-col gap-1">
        {elements.map((el) => {
          const row = rows[el.id];
          return (
            <div
              key={el.id}
              className="flex items-center gap-2 rounded-md border bg-card px-2 py-1.5 text-xs"
            >
              <ShapeChip type={row.targetType} size={14} />
              <span className="truncate font-medium">
                {row.targetName.trim() || el.name}
              </span>
              <span className="ms-auto truncate text-[10px] text-muted-foreground">
                {getElementTypeInfo(row.targetType).label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
