import type { LayerValue } from "./layer";

export type DiagramTypeValue =
  | "OEB"
  | "OAB"
  | "OPD"
  | "OCD"
  | "OIS"
  | "SAB"
  | "SDFB"
  | "SCD"
  | "SS"
  | "LAB"
  | "LDFB"
  | "LCB"
  | "LS"
  | "PAB"
  | "PDFB"
  | "PCB"
  | "PS"
  | "EPBB"
  | "EAB"
  | "ECB"
  | "CDB";

export type DiagramTypeInfo = {
  value: DiagramTypeValue;
  label: string;
  labelFa: string;
  layer: LayerValue;
};

export type ElementLayout = {
  elementId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
};

export type Viewport = {
  x: number;
  y: number;
  zoom: number;
};

export type Diagram = {
  id: string;
  modelId: string;
  type: DiagramTypeValue;
  name: string;
  description?: string;
  viewport: Viewport;
  elementLayouts: ElementLayout[];
  createdAt: string;
  updatedAt: string;
};
