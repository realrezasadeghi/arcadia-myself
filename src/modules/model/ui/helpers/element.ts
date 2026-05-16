import { ELEMENT_TYPES } from "../constants/element";
import type { ElementTypeInfo, ElementTypeValue } from "../types/element";
import type { LayerValue } from "../types/layer";

export function getElementTypeInfo(
  value: ElementTypeValue | string,
): ElementTypeInfo {
  return (
    ELEMENT_TYPES.find((e) => e.value === value) ?? {
      value: value as ElementTypeValue,
      label: value,
      labelFa: value,
      layer: "OA",
    }
  );
}

export function getElementTypesForLayer(
  layerValue: LayerValue | string,
): ElementTypeInfo[] {
  return ELEMENT_TYPES.filter((e) => e.layer === layerValue);
}
