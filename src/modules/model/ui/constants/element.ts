import type {
  ElementTypeInfo,
  ElementTypeValue,
  ElementVisualSpec,
} from "../types/element";

export const ELEMENT_TYPES: ElementTypeInfo[] = [
  // OA
  {
    value: "OperationalEntity",
    label: "Operational Entity",
    labelFa: "موجودیت عملیاتی",
    layer: "OA",
  },
  {
    value: "OperationalActor",
    label: "Operational Actor",
    labelFa: "بازیگر عملیاتی",
    layer: "OA",
  },
  {
    value: "OperationalActivity",
    label: "Operational Activity",
    labelFa: "فعالیت عملیاتی",
    layer: "OA",
  },
  {
    value: "OperationalCapability",
    label: "Operational Capability",
    labelFa: "قابلیت عملیاتی",
    layer: "OA",
  },
  {
    value: "OperationalProcess",
    label: "Operational Process",
    labelFa: "فرایند عملیاتی",
    layer: "OA",
  },
  // SA
  { value: "System", label: "System", labelFa: "سیستم", layer: "SA" },
  {
    value: "SystemActor",
    label: "System Actor",
    labelFa: "بازیگر سیستم",
    layer: "SA",
  },
  {
    value: "SystemFunction",
    label: "System Function",
    labelFa: "تابع سیستم",
    layer: "SA",
  },
  {
    value: "SystemCapability",
    label: "System Capability",
    labelFa: "قابلیت سیستم",
    layer: "SA",
  },
  {
    value: "SystemComponent",
    label: "System Component",
    labelFa: "مؤلفه سیستم",
    layer: "SA",
  },
  // LA
  {
    value: "LogicalComponent",
    label: "Logical Component",
    labelFa: "مؤلفه منطقی",
    layer: "LA",
  },
  {
    value: "LogicalActor",
    label: "Logical Actor",
    labelFa: "بازیگر منطقی",
    layer: "LA",
  },
  {
    value: "LogicalFunction",
    label: "Logical Function",
    labelFa: "تابع منطقی",
    layer: "LA",
  },
  // PA
  {
    value: "PhysicalComponent",
    label: "Physical Component",
    labelFa: "مؤلفه فیزیکی",
    layer: "PA",
  },
  {
    value: "PhysicalNode",
    label: "Physical Node",
    labelFa: "گره فیزیکی",
    layer: "PA",
  },
  {
    value: "PhysicalFunction",
    label: "Physical Function",
    labelFa: "تابع فیزیکی",
    layer: "PA",
  },
  {
    value: "PhysicalActor",
    label: "Physical Actor",
    labelFa: "بازیگر فیزیکی",
    layer: "PA",
  },
];

export const ELEMENT_VISUAL: Record<ElementTypeValue, ElementVisualSpec> = {
  OperationalEntity: {
    shape: "rounded-rectangle",
    fillColor: "#AED6F1",
    fillColorDark: "#1a3a52",
    strokeColor: "#2E86C1",
  },
  OperationalActor: {
    shape: "rounded-rectangle",
    fillColor: "#D5D8DC",
    fillColorDark: "#2d3436",
    strokeColor: "#717D7E",
  },
  OperationalActivity: {
    shape: "rectangle",
    fillColor: "#F9E79F",
    fillColorDark: "#3d3200",
    strokeColor: "#D4AC0D",
  },
  OperationalCapability: {
    shape: "ellipse",
    fillColor: "#A9DFBF",
    fillColorDark: "#1a3d2b",
    strokeColor: "#1E8449",
  },
  OperationalProcess: {
    shape: "rounded-rectangle",
    fillColor: "#D7BDE2",
    fillColorDark: "#2d1a3d",
    strokeColor: "#7D3C98",
  },
  System: {
    shape: "rounded-rectangle",
    fillColor: "#AED6F1",
    fillColorDark: "#1a3a52",
    strokeColor: "#1A5276",
  },
  SystemActor: {
    shape: "rounded-rectangle",
    fillColor: "#D5D8DC",
    fillColorDark: "#2d3436",
    strokeColor: "#717D7E",
  },
  SystemFunction: {
    shape: "rectangle",
    fillColor: "#FAD7A0",
    fillColorDark: "#3d2800",
    strokeColor: "#CA6F1E",
  },
  SystemCapability: {
    shape: "ellipse",
    fillColor: "#A9DFBF",
    fillColorDark: "#1a3d2b",
    strokeColor: "#1D8348",
  },
  SystemComponent: {
    shape: "rounded-rectangle",
    fillColor: "#85C1E9",
    fillColorDark: "#0d2d47",
    strokeColor: "#1A5276",
  },
  LogicalComponent: {
    shape: "rounded-rectangle",
    fillColor: "#A9DFBF",
    fillColorDark: "#1a3d2b",
    strokeColor: "#1E8449",
  },
  LogicalActor: {
    shape: "rounded-rectangle",
    fillColor: "#D5D8DC",
    fillColorDark: "#2d3436",
    strokeColor: "#717D7E",
  },
  LogicalFunction: {
    shape: "rectangle",
    fillColor: "#F9E79F",
    fillColorDark: "#3d3200",
    strokeColor: "#D4AC0D",
  },
  PhysicalComponent: {
    shape: "rectangle",
    fillColor: "#D2B4DE",
    fillColorDark: "#2d1a3d",
    strokeColor: "#6C3483",
  },
  PhysicalNode: {
    shape: "rectangle",
    fillColor: "#AEB6BF",
    fillColorDark: "#1a1f24",
    strokeColor: "#2C3E50",
  },
  PhysicalFunction: {
    shape: "rectangle",
    fillColor: "#FAD7A0",
    fillColorDark: "#3d2800",
    strokeColor: "#CA6F1E",
  },
  PhysicalActor: {
    shape: "rounded-rectangle",
    fillColor: "#D5D8DC",
    fillColorDark: "#2d3436",
    strokeColor: "#717D7E",
  },
};
