import { Layer } from "../../domain/value-objects/layer";
import { LAYERS, OFFERED_LAYERS } from "../constants/layer";
import type { LayerInfo, LayerValue } from "../types/layer";

export function getLayerInfo(value: LayerValue | string): LayerInfo {
  return LAYERS.find((l) => l.value === value) ?? LAYERS[0];
}

export function getSectionTitle(value: LayerValue | string): string {
  return getLayerInfo(value).sectionTitle;
}

export function getOfferedLayers(): LayerInfo[] {
  return OFFERED_LAYERS;
}

export function getNextOfferedLayer(
  value: LayerValue | string,
): LayerValue | null {
  const current = Layer.tryFrom(value);
  const next = current?.nextLayer();
  if (!next) return null;
  return OFFERED_LAYERS.some((l) => l.value === next.value) ? next.value : null;
}

export function getNextOfferedLayerLabel(
  value: LayerValue | string,
): string | null {
  const next = getNextOfferedLayer(value);
  return next ? getLayerInfo(next).sectionTitle : null;
}
