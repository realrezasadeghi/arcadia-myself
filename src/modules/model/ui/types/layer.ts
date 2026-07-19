export type LayerValue = "OA" | "SA" | "LA" | "PA" | "EPBS";

export interface LayerInfo {
  value: LayerValue;
  label: string;
  labelFa: string;
  order: number;
}
