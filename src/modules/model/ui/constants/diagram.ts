import type { DiagramTypeInfo, DiagramTypeValue } from "../types/diagram";
import type { LayerValue } from "../types/layer";

export const DIAGRAM_TYPES: DiagramTypeInfo[] = [
  // ─── Operational Analysis (OA) ───────────────────────────────────────────
  {
    value: "OEB",
    label: "Operational Entity Breakdown",
    labelFa: "تجزیه موجودیت عملیاتی",
    layer: "OA",
  },
  {
    value: "OCD",
    label: "Operational Capability Blank",
    labelFa: "بوم قابلیت عملیاتی",
    layer: "OA",
  },
  {
    value: "OAB",
    label: "Operational Activity Diagram",
    labelFa: "دیاگرام فعالیت عملیاتی",
    layer: "OA",
  },
  {
    value: "OPD",
    label: "Operational Activity Interaction Blank",
    labelFa: "بوم تعامل فعالیت عملیاتی",
    layer: "OA",
  },
  {
    value: "OIS",
    label: "Operational Activity Scenario",
    labelFa: "سناریوی فعالیت عملیاتی",
    layer: "OA",
  },
  {
    value: "OAAB",
    label: "Operational Architecture Blank",
    labelFa: "بوم معماری عملیاتی",
    layer: "OA",
  },
  // ─── System Analysis (SA) ────────────────────────────────────────────────
  {
    value: "CSA",
    label: "Context System Actors",
    labelFa: "زمینه بازیگران سیستم",
    layer: "SA",
  },
  {
    value: "SCD",
    label: "Mission Capability Blank",
    labelFa: "بوم قابلیت مأموریت",
    layer: "SA",
  },
  {
    value: "SFB",
    label: "System Function Breakdown",
    labelFa: "تجزیه کارکرد سیستم",
    layer: "SA",
  },
  {
    value: "SDFB",
    label: "System Data Flow Blank",
    labelFa: "بوم جریان داده سیستم",
    layer: "SA",
  },
  {
    value: "SAB",
    label: "System Architecture Blank",
    labelFa: "بوم معماری سیستم",
    layer: "SA",
  },
  {
    value: "SS",
    label: "Functional Scenario",
    labelFa: "سناریوی کارکردی",
    layer: "SA",
  },
  // ─── Logical Architecture (LA) ───────────────────────────────────────────
  {
    value: "LCB",
    label: "Logical Component Breakdown",
    labelFa: "تجزیه مؤلفه منطقی",
    layer: "LA",
  },
  {
    value: "LFB",
    label: "Logical Function Breakdown",
    labelFa: "تجزیه کارکرد منطقی",
    layer: "LA",
  },
  {
    value: "LDFB",
    label: "Logical Dataflow Breakdown",
    labelFa: "تجزیه جریان داده منطقی",
    layer: "LA",
  },
  {
    value: "LAB",
    label: "Logical Architecture Blank",
    labelFa: "بوم معماری منطقی",
    layer: "LA",
  },
  {
    value: "LS",
    label: "Functional Scenario",
    labelFa: "سناریوی کارکردی",
    layer: "LA",
  },
  // ─── Physical Architecture (PA) ──────────────────────────────────────────
  {
    value: "PCB",
    label: "Physical Component Breakdown",
    labelFa: "تجزیه مؤلفه فیزیکی",
    layer: "PA",
  },
  {
    value: "PFB",
    label: "Physical Function Breakdown",
    labelFa: "تجزیه کارکرد فیزیکی",
    layer: "PA",
  },
  {
    value: "PDFB",
    label: "Physical Dataflow Blank",
    labelFa: "بوم جریان داده فیزیکی",
    layer: "PA",
  },
  {
    value: "PAB",
    label: "Physical Architecture Blank",
    labelFa: "بوم معماری فیزیکی",
    layer: "PA",
  },
  {
    value: "PS",
    label: "Functional Scenario Diagram",
    labelFa: "دیاگرام سناریوی کارکردی",
    layer: "PA",
  },
  // ─── Transverse ──────────────────────────────────────────────────────────
  {
    value: "CDB",
    label: "Class Diagram",
    labelFa: "دیاگرام کلاس",
    layer: "SA",
  },
];

export const DIAGRAMS_BY_LAYER: Record<LayerValue, DiagramTypeValue[]> = {
  OA: ["OEB", "OCD", "OAB", "OPD", "OIS", "OAAB", "CDB"],
  SA: ["CSA", "SCD", "SFB", "SDFB", "SAB", "SS", "CDB"],
  LA: ["LCB", "LFB", "LDFB", "LAB", "LS", "CDB"],
  PA: ["PCB", "PFB", "PDFB", "PAB", "PS", "CDB"],
  // Legacy layer — no diagram types offered in the UI.
  EPBS: [],
};
