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

export type CanvasNodeType =
  | "actor-node"
  | "function-node"
  | "component-node"
  | "architecture-node"
  | "class-node";

/**
 * Maps an Arcadia element type to the React Flow custom node type.
 * All element types — architecture AND class diagram — go through here.
 */
export function getNodeTypeForElement(type: ElementTypeValue): CanvasNodeType {
  // Class diagram types
  if (
    type === "Class" ||
    type === "Interface" ||
    type === "DataType" ||
    type === "Enumeration" ||
    type === "PrimitiveType" ||
    type === "Collection" ||
    type === "ExchangeItem"
  ) {
    return "class-node";
  }
  // Architecture types
  if (type.endsWith("Actor") || type.endsWith("Entity")) return "actor-node";
  if (type.endsWith("Function") || type.endsWith("Activity"))
    return "function-node";
  if (type.endsWith("Component")) return "component-node";
  return "architecture-node";
}
