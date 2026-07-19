import type { LayerInfo, LayerValue } from "../types/layer";

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
    labelFa: "تحلیل سیستم",
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
  {
    value: "EPBS",
    label: "End-Product Breakdown",
    labelFa: "ساختار محصول نهایی",
    order: 5,
  },
];

export const LAYER_COLORS: Record<
  LayerValue,
  { bg: string; text: string; border: string; activeBg: string }
> = {
  OA: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    activeBg: "bg-blue-100",
  },
  SA: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    activeBg: "bg-amber-100",
  },
  LA: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    activeBg: "bg-emerald-100",
  },
  PA: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    activeBg: "bg-purple-100",
  },
  EPBS: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    activeBg: "bg-rose-100",
  },
};
