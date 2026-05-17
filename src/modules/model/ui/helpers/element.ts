import { ELEMENT_TYPES, ELEMENT_VISUAL } from "../constants/element";
import type {
  ElementTypeInfo,
  ElementTypeValue,
  ElementVisualSpec,
} from "../types/element";
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

export function getElementVisual(type: ElementTypeValue): ElementVisualSpec {
  return (
    ELEMENT_VISUAL[type] ?? {
      shape: "rectangle",
      fillColor: "#E5E7EB",
      fillColorDark: "#374151",
      strokeColor: "#9CA3AF",
    }
  );
}
