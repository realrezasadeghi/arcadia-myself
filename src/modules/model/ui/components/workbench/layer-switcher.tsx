"use client";

import { cn } from "@/modules/shared/ui/libs/cn";
import { LAYER_HEX_COLORS } from "../../constants/layer";
import { getLayerInfo } from "../../helpers/layer";
import type { LayerValue } from "../../types/layer";
import type { Model } from "../../types/model";

type LayerSwitcherProps = {
  models: Model[];
  currentLayer: LayerValue;
  onLayerChange: (layer: LayerValue, modelId: string) => void;
};

export function LayerSwitcher({
  models,
  currentLayer,
  onLayerChange,
}: LayerSwitcherProps) {
  const layers: LayerValue[] = ["OA", "SA", "LA", "PA", "EPBS"];

  return (
    <div className="flex items-center gap-1 border-b bg-muted/20 px-3 py-1">
      <span className="me-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Layer:
      </span>
      {layers.map((layer) => {
        const info = getLayerInfo(layer);
        const color = LAYER_HEX_COLORS[layer];
        const isActive = currentLayer === layer;
        const model = models.find((m) => m.layer === layer);
        const hasModel = !!model;

        return (
          <button
            key={layer}
            type="button"
            onClick={() => {
              if (model) onLayerChange(layer, model.id);
            }}
            disabled={!hasModel}
            className={cn(
              "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-all",
              isActive
                ? "border-current bg-current/10 shadow-sm"
                : hasModel
                  ? "border-border hover:border-current/40 hover:bg-muted"
                  : "border-dashed border-border/40 opacity-40 cursor-not-allowed",
            )}
            style={isActive ? { color, borderColor: color } : undefined}
            title={hasModel ? info.label : `No ${info.label} model yet`}
          >
            <span
              className={cn(
                "size-2 rounded-sm",
                isActive ? "opacity-100" : "opacity-60",
              )}
              style={{ backgroundColor: color }}
            />
            <span>{layer}</span>
            {isActive && (
              <span className="text-[9px] opacity-60 hidden sm:inline">
                {info.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
