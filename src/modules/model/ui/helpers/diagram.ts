import { DIAGRAM_TYPES } from "../constants/diagram";
import type { DiagramTypeInfo } from "../types/diagram";
import type { LayerValue } from "../types/layer";

export function getDiagramTypeInfo(value: string): DiagramTypeInfo | undefined {
  return DIAGRAM_TYPES.find((d) => d.value === value);
}

export function getDiagramTypesForLayer(
  layerValue: LayerValue | string,
): DiagramTypeInfo[] {
  return DIAGRAM_TYPES.filter((d) => d.layer === layerValue);
}

export function getDiagramLayer(typeValue: string): LayerValue {
  return getDiagramTypeInfo(typeValue)?.layer ?? "OA";
}
