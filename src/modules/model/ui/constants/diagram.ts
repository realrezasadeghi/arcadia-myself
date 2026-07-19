import type { DiagramTypeInfo, DiagramTypeValue } from "../types/diagram";
import { LayerValue } from "../types/layer";

export const DIAGRAM_TYPES: DiagramTypeInfo[] = [
  {
    value: "OEB",
    label: "Operational Entity Breakdown",
    labelFa: "تجزیه موجودیت عملیاتی",
    layer: "OA",
  },
  {
    value: "OAB",
    label: "Operational Activity Breakdown",
    labelFa: "تجزیه فعالیت عملیاتی",
    layer: "OA",
  },
  {
    value: "OPD",
    label: "Operational Process Description",
    labelFa: "توصیف فرایند عملیاتی",
    layer: "OA",
  },
  {
    value: "OCD",
    label: "Operational Capability Diagram",
    labelFa: "دیاگرام قابلیت عملیاتی",
    layer: "OA",
  },
  {
    value: "OIS",
    label: "Operational Interaction Scenario",
    labelFa: "سناریو تعامل عملیاتی",
    layer: "OA",
  },
  {
    value: "SAB",
    label: "System Architecture Blank",
    labelFa: "معماری سیستم",
    layer: "SA",
  },
  {
    value: "SDFB",
    label: "System Data Flow Blank",
    labelFa: "جریان داده سیستم",
    layer: "SA",
  },
  {
    value: "SCD",
    label: "System Capability Diagram",
    labelFa: "دیاگرام قابلیت سیستم",
    layer: "SA",
  },
  {
    value: "SS",
    label: "System Scenario",
    labelFa: "سناریو سیستم",
    layer: "SA",
  },
  {
    value: "LAB",
    label: "Logical Architecture Blank",
    labelFa: "معماری منطقی",
    layer: "LA",
  },
  {
    value: "LDFB",
    label: "Logical Data Flow Blank",
    labelFa: "جریان داده منطقی",
    layer: "LA",
  },
  {
    value: "LCB",
    label: "Logical Component Breakdown",
    labelFa: "تجزیه مؤلفه منطقی",
    layer: "LA",
  },
  {
    value: "LS",
    label: "Logical Scenario",
    labelFa: "سناریو منطقی",
    layer: "LA",
  },
  {
    value: "PAB",
    label: "Physical Architecture Blank",
    labelFa: "معماری فیزیکی",
    layer: "PA",
  },
  {
    value: "PDFB",
    label: "Physical Data Flow Blank",
    labelFa: "جریان داده فیزیکی",
    layer: "PA",
  },
  {
    value: "PCB",
    label: "Physical Component Breakdown",
    labelFa: "تجزیه مؤلفه فیزیکی",
    layer: "PA",
  },
  {
    value: "PS",
    label: "Physical Scenario",
    labelFa: "سناریو فیزیکی",
    layer: "PA",
  },
  {
    value: "EPBB",
    label: "EPBS Breakdown",
    labelFa: "تجزیه محصول نهایی",
    layer: "EPBS",
  },
];

export const DIAGRAMS_BY_LAYER: Record<LayerValue, DiagramTypeValue[]> = {
  OA: ["OEB", "OAB", "OPD", "OCD", "OIS"],
  SA: ["SAB", "SDFB", "SCD", "SS"],
  LA: ["LAB", "LDFB", "LCB", "LS"],
  PA: ["PAB", "PDFB", "PCB", "PS"],
  EPBS: ["EPBB"],
};
