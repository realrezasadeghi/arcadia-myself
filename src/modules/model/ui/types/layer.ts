export type LayerValue = "OA" | "SA" | "LA" | "PA";

export interface LayerInfo {
  value: LayerValue;
  label: string;
  labelFa: string;
  order: number;
}
