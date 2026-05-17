import type { LayerInfo } from "../types/layer";

export const LAYERS: LayerInfo[] = [
  {
    value: "OA",
    label: "Operational Analysis",
    labelFa: "تحلیل عملیاتی",
    order: 1,
  },
  {
    value: "SA",
    label: "System Analysis",
    labelFa: "تحلیل سیستمی",
    order: 2,
  },
  {
    value: "LA",
    label: "Logical Architecture",
    labelFa: "معماری منطقی",
    order: 3,
  },
  {
    value: "PA",
    label: "Physical Architecture",
    labelFa: "معماری فیزیکی",
    order: 4,
  },
];
