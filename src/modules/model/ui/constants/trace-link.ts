import {
  RELATIONSHIP_DEFINITIONS,
  relationshipDefinitionsOfKind,
} from "../../domain/relationships/definitions";
import { TRACE_RULES as DOMAIN_TRACE_RULES } from "../../domain/relationships/rules";
import type { LayerValue } from "../types/layer";
import type {
  TraceLinkRule,
  TraceLinkTypeInfo,
  TraceLinkTypeValue,
  TraceLinkVisualSpec,
} from "../types/trace-link";

/** Display metadata for trace link types — derived from the domain registry. */
export const TRACE_LINK_TYPES: TraceLinkTypeInfo[] =
  relationshipDefinitionsOfKind("trace").map((definition) => ({
    value: definition.value as TraceLinkTypeValue,
    label: definition.label,
    labelFa: definition.labelFa,
  }));

/** Trace rules projected to the UI shape (adds Persian labels). */
export const TRACE_RULES: TraceLinkRule[] = DOMAIN_TRACE_RULES.map((rule) => ({
  type: rule.type,
  typeLabelFa: RELATIONSHIP_DEFINITIONS[rule.type].labelFa,
  sourceLayer: rule.sourceLayer.value,
  sourceTypes: rule.sourceTypes,
  targetLayer: rule.targetLayer.value,
  targetLayerLabelFa: rule.targetLayer.labelFa,
  targetTypes: rule.targetTypes,
}));

export const TRACE_VISUAL: Record<TraceLinkTypeValue, TraceLinkVisualSpec> = {
  Realization: {
    strokeColor: "#8E44AD",
    strokeWidth: 1,
    arrowEnd: "open-arrow",
    strokeDash: "4,2",
  },
  Refinement: {
    strokeColor: "#1A5276",
    strokeWidth: 1,
    arrowEnd: "open-arrow",
    strokeDash: "5,3",
  },
};

/**
 * Layer pairs shown in the traceability matrix.
 *
 * `lower` is the more concrete layer (the trace source) and `upper` the more
 * abstract one (the trace target), so the label reads in stored direction:
 * the concrete layer realizes the abstract one.
 */
export const LAYER_PAIRS: Array<{
  upper: LayerValue;
  lower: LayerValue;
  label: string;
}> = [
  { upper: "OA", lower: "SA", label: "SA → OA" },
  { upper: "SA", lower: "LA", label: "LA → SA" },
  { upper: "LA", lower: "PA", label: "PA → LA" },
];
