"use client";

import { GitBranchPlus } from "lucide-react";
import { cn } from "@/modules/shared/ui/libs/cn";
import { LAYER_HEX_COLORS, OFFERED_LAYERS } from "../../constants/layer";
import { getLayerInfo, getNextOfferedLayer } from "../../helpers/layer";
import { useWorkbenchStore } from "../../stores/workbench";
import type { LayerValue } from "../../types/layer";
import type { Model } from "../../types/model";

type LayerSwitcherProps = {
  models: Model[];
  /** Layers to offer. Defaults to every offered ARCADIA layer (RBAC filtering upstream). */
  layers?: readonly LayerValue[];
  currentLayer: LayerValue;
  onLayerChange: (layer: LayerValue, modelId: string) => void;
  onTransition: (model: Model) => void;
};

export function LayerSwitcher({
  models,
  layers = OFFERED_LAYERS.map((layer) => layer.value),
  currentLayer,
  onLayerChange,
  onTransition,
}: LayerSwitcherProps) {
  const currentModel = models.find((m) => m.layer === currentLayer);
  const nextLayer = getNextOfferedLayer(currentLayer);
  // RBAC: a transition mutates both the source and the target layer.
  const canTransition = useWorkbenchStore(
    (s) =>
      s.canEditLayer(currentLayer) &&
      (nextLayer !== null ? s.canEditLayer(nextLayer) : false),
  );
  const transition =
    canTransition && currentModel && nextLayer
      ? {
          model: currentModel,
          targetLayer: nextLayer,
          label: getLayerInfo(nextLayer).label,
        }
      : null;

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

      {transition && (
        <button
          type="button"
          onClick={() => onTransition(transition.model)}
          className="ms-auto flex items-center gap-1.5 rounded-md border border-dashed border-primary/40 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary transition-all hover:border-primary/60 hover:bg-primary/10"
          title={`Carry this layer's elements into ${transition.label} and link them with Realization traces`}
          aria-label={`Transition to ${transition.label}`}
        >
          <GitBranchPlus className="size-3" />
          <span className="hidden sm:inline">Transition to</span>
          {transition.label}
        </button>
      )}
    </div>
  );
}
