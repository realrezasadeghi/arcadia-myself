import type { LayerValue } from "../types/layer";
import type {
  TraceLinkRule,
  TraceLinkTypeInfo,
  TraceLinkTypeValue,
  TraceLinkVisualSpec,
} from "../types/trace-link";

export const TRACE_LINK_TYPES: TraceLinkTypeInfo[] = [
  { value: "Realization", label: "Realization", labelFa: "تحقق" },
  { value: "Allocation", label: "Allocation", labelFa: "تخصیص" },
  { value: "Deployment", label: "Deployment", labelFa: "استقرار" },
  { value: "Involvement", label: "Involvement", labelFa: "مشارکت" },
  { value: "Refinement", label: "Refinement", labelFa: "اصلاح" },
  { value: "Owned", label: "Owned", labelFa: "مالکیت" },
];

export const TRACE_RULES: TraceLinkRule[] = [
  {
    type: "Realization",
    typeLabelFa: "تحقق",
    sourceLayer: "SA",
    sourceTypes: ["SystemFunction"],
    targetLayer: "OA",
    targetLayerLabelFa: "تحلیل عملیاتی",
    targetTypes: ["OperationalActivity"],
  },
  {
    type: "Realization",
    typeLabelFa: "تحقق",
    sourceLayer: "SA",
    sourceTypes: ["SystemActor"],
    targetLayer: "OA",
    targetLayerLabelFa: "تحلیل عملیاتی",
    targetTypes: ["OperationalEntity", "OperationalActor"],
  },
  {
    type: "Realization",
    typeLabelFa: "تحقق",
    sourceLayer: "SA",
    sourceTypes: ["SystemCapability"],
    targetLayer: "OA",
    targetLayerLabelFa: "تحلیل عملیاتی",
    targetTypes: ["OperationalCapability"],
  },
  // LA realizes SA
  {
    type: "Realization",
    typeLabelFa: "تحقق",
    sourceLayer: "LA",
    sourceTypes: ["LogicalFunction"],
    targetLayer: "SA",
    targetLayerLabelFa: "تحلیل سیستم",
    targetTypes: ["SystemFunction"],
  },
  {
    type: "Realization",
    typeLabelFa: "تحقق",
    sourceLayer: "LA",
    sourceTypes: ["LogicalComponent"],
    targetLayer: "SA",
    targetLayerLabelFa: "تحلیل سیستم",
    targetTypes: ["SystemComponent"],
  },
  {
    type: "Realization",
    typeLabelFa: "تحقق",
    sourceLayer: "LA",
    sourceTypes: ["LogicalActor"],
    targetLayer: "SA",
    targetLayerLabelFa: "تحلیل سیستم",
    targetTypes: ["SystemActor"],
  },
  // PA realizes LA
  {
    type: "Realization",
    typeLabelFa: "تحقق",
    sourceLayer: "PA",
    sourceTypes: ["PhysicalComponent"],
    targetLayer: "LA",
    targetLayerLabelFa: "معماری منطقی",
    targetTypes: ["LogicalComponent"],
  },
  {
    type: "Realization",
    typeLabelFa: "تحقق",
    sourceLayer: "PA",
    sourceTypes: ["PhysicalFunction"],
    targetLayer: "LA",
    targetLayerLabelFa: "معماری منطقی",
    targetTypes: ["LogicalFunction"],
  },
  {
    type: "Realization",
    typeLabelFa: "تحقق",
    sourceLayer: "PA",
    sourceTypes: ["PhysicalActor"],
    targetLayer: "LA",
    targetLayerLabelFa: "معماری منطقی",
    targetTypes: ["LogicalActor"],
  },
  // Allocation (intra-layer)
  {
    type: "Allocation",
    typeLabelFa: "تخصیص",
    sourceLayer: "LA",
    sourceTypes: ["LogicalFunction"],
    targetLayer: "LA",
    targetLayerLabelFa: "معماری منطقی",
    targetTypes: ["LogicalComponent"],
  },
  {
    type: "Allocation",
    typeLabelFa: "تخصیص",
    sourceLayer: "PA",
    sourceTypes: ["PhysicalFunction"],
    targetLayer: "PA",
    targetLayerLabelFa: "معماری فیزیکی",
    targetTypes: ["PhysicalComponent"],
  },
  // Deployment
  {
    type: "Deployment",
    typeLabelFa: "استقرار",
    sourceLayer: "PA",
    sourceTypes: ["PhysicalComponent"],
    targetLayer: "PA",
    targetLayerLabelFa: "معماری فیزیکی",
    targetTypes: ["PhysicalNode"],
  },
  // Involvement
  {
    type: "Involvement",
    typeLabelFa: "مشارکت",
    sourceLayer: "OA",
    sourceTypes: ["OperationalEntity", "OperationalActor"],
    targetLayer: "OA",
    targetLayerLabelFa: "تحلیل عملیاتی",
    targetTypes: ["OperationalCapability"],
  },
  // EPBS realizes PA
  {
    type: "Realization",
    typeLabelFa: "تحقق",
    sourceLayer: "EPBS",
    sourceTypes: ["ConfigurationItem"],
    targetLayer: "PA",
    targetLayerLabelFa: "معماری فیزیکی",
    targetTypes: ["PhysicalComponent", "PhysicalActor"],
  },
  // EPBS Owned (parent breakdown)
  {
    type: "Owned",
    typeLabelFa: "مالکیت",
    sourceLayer: "EPBS",
    sourceTypes: ["ConfigurationItem", "ConfigurationItemPart"],
    targetLayer: "EPBS",
    targetLayerLabelFa: "ساختار محصول نهایی",
    targetTypes: ["ConfigurationItem", "ConfigurationItemPart"],
  },
];

export const TRACE_VISUAL: Record<TraceLinkTypeValue, TraceLinkVisualSpec> = {
  Realization: {
    strokeColor: "#8E44AD",
    strokeWidth: 1,
    arrowEnd: "open-arrow",
    strokeDash: "4,2",
  },
  Allocation: {
    strokeColor: "#E67E22",
    strokeWidth: 1,
    arrowEnd: "open-arrow",
    strokeDash: "4,2",
  },
  Deployment: {
    strokeColor: "#2C3E50",
    strokeWidth: 1,
    arrowEnd: "open-arrow",
    strokeDash: "6,2",
  },
  Involvement: {
    strokeColor: "#717D7E",
    strokeWidth: 1,
    arrowEnd: "open-arrow",
    strokeDash: "3,3",
  },
  Refinement: {
    strokeColor: "#1A5276",
    strokeWidth: 1,
    arrowEnd: "open-arrow",
    strokeDash: "5,3",
  },
  Owned: {
    strokeColor: "#27AE60",
    strokeWidth: 1,
    arrowEnd: "open-arrow",
    strokeDash: "2,4",
  },
};

export const LAYER_PAIRS: Array<{
  upper: LayerValue;
  lower: LayerValue;
  label: string;
}> = [
  { upper: "OA", lower: "SA", label: "OA → SA" },
  { upper: "SA", lower: "LA", label: "SA → LA" },
  { upper: "LA", lower: "PA", label: "LA → PA" },
  { upper: "EPBS", lower: "PA", label: "EPBS → PA" },
];
