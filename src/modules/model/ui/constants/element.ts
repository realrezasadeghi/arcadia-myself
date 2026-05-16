import type { ElementTypeInfo } from "../types/element";

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
