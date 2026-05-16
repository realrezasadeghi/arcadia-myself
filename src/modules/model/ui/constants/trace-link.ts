import type { TraceLinkRule, TraceLinkTypeInfo } from "../types/trace-link";

export const TRACE_LINK_TYPES: TraceLinkTypeInfo[] = [
  { value: "Realization", label: "Realization", labelFa: "تحقق" },
  { value: "Allocation", label: "Allocation", labelFa: "تخصیص" },
  { value: "Deployment", label: "Deployment", labelFa: "استقرار" },
  { value: "Involvement", label: "Involvement", labelFa: "مشارکت" },
  { value: "Refinement", label: "Refinement", labelFa: "اصلاح" },
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
];
