import { LAYERS } from "../constants/layer";
import type { LayerInfo, LayerValue } from "../types/layer";

export function getLayerInfo(value: LayerValue | string): LayerInfo {
  return LAYERS.find((l) => l.value === value) ?? LAYERS[0];
}
