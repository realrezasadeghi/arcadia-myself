import type { LayerValue } from "./layer";

export type ElementStatus = "DRAFT" | "VALIDATED" | "DEPRECATED";

export type ElementTypeValue =
  | "Mission"
  | "OperationalEntity"
  | "OperationalActor"
  | "OperationalActivity"
  | "OperationalCapability"
  | "OperationalProcess"
  | "System"
  | "SystemActor"
  | "SystemFunction"
  | "SystemCapability"
  | "SystemComponent"
  | "FunctionPort"
  | "LogicalComponent"
  | "LogicalActor"
  | "LogicalFunction"
  | "PhysicalComponent"
  | "PhysicalNode"
  | "PhysicalFunction"
  | "PhysicalActor"
  | "EPBSComponent";

export type ElementTypeInfo = {
  value: ElementTypeValue;
  label: string;
  labelFa: string;
  layer: LayerValue;
};

export type Element = {
  id: string;
  modelId: string;
  type: ElementTypeValue;
  name: string;
  description?: string;
  status: ElementStatus;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ElementVisualSpec = {
  shape: "rectangle" | "rounded-rectangle" | "ellipse";
  fillColor: string;
  fillColorDark: string;
  strokeColor: string;
};
