import {
  type LayerValue as DomainLayerValue,
  Layer,
} from "../../domain/value-objects/layer";
import type { LayerInfo, LayerValue } from "../types/layer";

interface LayerPalette {
  hex: string;
  bg: string;
  text: string;
  border: string;
  activeBg: string;
}

const PALETTE: Record<DomainLayerValue, LayerPalette> = {
  OA: {
    hex: "#2E86C1",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    activeBg: "bg-blue-100",
  },
  SA: {
    hex: "#CA6F1E",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    activeBg: "bg-amber-100",
  },
  LA: {
    hex: "#1E8449",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    activeBg: "bg-emerald-100",
  },
  PA: {
    hex: "#6C3483",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    activeBg: "bg-purple-100",
  },
  EPBS: {
    hex: "#E74C3C",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    activeBg: "bg-rose-100",
  },
};

export const LAYER_PALETTE: Record<LayerValue, LayerPalette> = PALETTE;

/** Hex colors for inline styles (background-color, color attributes). */
export const LAYER_HEX_COLORS: Record<LayerValue, string> = Object.fromEntries(
  Object.entries(PALETTE).map(([value, colors]) => [value, colors.hex]),
) as Record<LayerValue, string>;

export const LAYER_COLORS: Record<
  LayerValue,
  { bg: string; text: string; border: string; activeBg: string }
> = Object.fromEntries(
  Object.entries(PALETTE).map(([value, colors]) => [
    value,
    {
      bg: colors.bg,
      text: colors.text,
      border: colors.border,
      activeBg: colors.activeBg,
    },
  ]),
) as Record<
  LayerValue,
  { bg: string; text: string; border: string; activeBg: string }
>;

function toLayerInfo(layer: Layer): LayerInfo {
  return {
    value: layer.value,
    label: layer.label,
    labelFa: layer.labelFa,
    sectionTitle: layer.sectionTitle,
    sectionTitleFa: layer.sectionTitleFa,
    description: layer.description,
    descriptionFa: layer.descriptionFa,
    order: layer.order,
  };
}

/** Every Arcadia layer, projected from the domain `Layer` value object. */
export const LAYERS: LayerInfo[] = Layer.all().map(toLayerInfo);

/**
 * Layers offered in layer pickers — EPBS intentionally excluded (legacy only).
 */
export const OFFERED_LAYERS: LayerInfo[] = LAYERS.filter(
  (layer) => layer.value !== "EPBS",
);
