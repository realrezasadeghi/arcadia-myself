import type {
  ElementTypeInfo,
  ElementTypeValue,
  ElementVisualSpec,
} from "../types/element";
import type { LayerValue } from "../types/layer";

export const ELEMENT_TYPES: ElementTypeInfo[] = [
  // ─── OA ───────────────────────────────────────────────────────────────────
  { value: "Mission", label: "Mission", labelFa: "مأموریت", layer: "OA" }, // ← NEW
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
  // ─── SA ───────────────────────────────────────────────────────────────────
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
  {
    value: "FunctionPort",
    label: "Function Port",
    labelFa: "پورت تابع",
    layer: "SA",
  }, // ← NEW
  // ─── LA ───────────────────────────────────────────────────────────────────
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
  // ─── PA ───────────────────────────────────────────────────────────────────
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
  // ─── Information Modeling (valid in SA, LA, PA) ───────────────────────────
  { value: "Class", label: "Class", labelFa: "کلاس", layer: "SA" },
  { value: "Interface", label: "Interface", labelFa: "رابط", layer: "SA" },
  {
    value: "DataType",
    label: "DataType",
    labelFa: "نوع داده",
    layer: "SA",
  },
  {
    value: "Enumeration",
    label: "Enumeration",
    labelFa: "شمارشی",
    layer: "SA",
  },
  {
    value: "PrimitiveType",
    label: "Primitive Type",
    labelFa: "نوع اولیه",
    layer: "SA",
  },
  { value: "Collection", label: "Collection", labelFa: "مجموعه", layer: "SA" },
  {
    value: "ExchangeItem",
    label: "Exchange Item",
    labelFa: "آیتم تبادل",
    layer: "SA",
  },
];

export const ELEMENT_VISUAL: Record<ElementTypeValue, ElementVisualSpec> = {
  // ─── OA ───────────────────────────────────────────────────────────────────
  Mission: {
    // ← NEW
    shape: "ellipse",
    fillColor: "#D5F5E3",
    fillColorDark: "#0d2b1a",
    strokeColor: "#1D8348",
  },
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
  // ─── SA ───────────────────────────────────────────────────────────────────
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
  FunctionPort: {
    // ← NEW
    shape: "rectangle",
    fillColor: "#FDEBD0",
    fillColorDark: "#3d1a00",
    strokeColor: "#E67E22",
  },
  // ─── LA ───────────────────────────────────────────────────────────────────
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
  // ─── PA ───────────────────────────────────────────────────────────────────
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
  // ─── Information Modeling ──────────────────────────────────────────────────
  Class: {
    shape: "rectangle",
    fillColor: "#D6EAF8",
    fillColorDark: "#1a3a52",
    strokeColor: "#2874A6",
  },
  Interface: {
    shape: "rectangle",
    fillColor: "#E8DAEF",
    fillColorDark: "#2d1a3d",
    strokeColor: "#7D3C98",
  },
  DataType: {
    shape: "rectangle",
    fillColor: "#D5F5E3",
    fillColorDark: "#0d2b1a",
    strokeColor: "#1E8449",
  },
  Enumeration: {
    shape: "rectangle",
    fillColor: "#FCF3CF",
    fillColorDark: "#3d3200",
    strokeColor: "#D4AC0D",
  },
  PrimitiveType: {
    shape: "rectangle",
    fillColor: "#FDEBD0",
    fillColorDark: "#3d1a00",
    strokeColor: "#E67E22",
  },
  Collection: {
    shape: "rectangle",
    fillColor: "#FADBD8",
    fillColorDark: "#3d1a1a",
    strokeColor: "#E74C3C",
  },
  ExchangeItem: {
    shape: "rectangle",
    fillColor: "#D5D8DC",
    fillColorDark: "#2d3436",
    strokeColor: "#717D7E",
  },
};

export const INFORMATION_ELEMENT_TYPES: ElementTypeValue[] = [
  "Class",
  "Interface",
  "DataType",
  "Enumeration",
  "PrimitiveType",
  "Collection",
  "ExchangeItem",
];

export const ELEMENTS_BY_LAYER: Record<LayerValue, ElementTypeValue[]> = {
  OA: [
    "Mission",
    "OperationalEntity",
    "OperationalActor",
    "OperationalActivity",
    "OperationalCapability",
    "OperationalProcess",
  ],
  SA: [
    "System",
    "SystemActor",
    "SystemFunction",
    "SystemCapability",
    "SystemComponent",
    "FunctionPort",
    ...INFORMATION_ELEMENT_TYPES,
  ],
  LA: [
    "LogicalComponent",
    "LogicalActor",
    "LogicalFunction",
    ...INFORMATION_ELEMENT_TYPES,
  ],
  PA: [
    "PhysicalComponent",
    "PhysicalNode",
    "PhysicalFunction",
    "PhysicalActor",
    ...INFORMATION_ELEMENT_TYPES,
  ],
};
