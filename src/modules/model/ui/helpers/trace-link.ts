import { TRACE_LINK_TYPES, TRACE_RULES } from "../constants/trace-link";
import type { ElementTypeValue } from "../types/element";
import type { LayerValue } from "../types/layer";
import type { TraceLinkOption } from "../types/trace-link";

export function getTraceLinkTypeInfo(value: string): {
  value: string;
  label: string;
  labelFa: string;
} {
  return (
    TRACE_LINK_TYPES.find((t) => t.value === value) ?? {
      value,
      label: value,
      labelFa: value,
    }
  );
}

export function getTraceOptions(
  sourceTypeValue: ElementTypeValue | string,
  sourceLayerValue: LayerValue | string,
): TraceLinkOption[] {
  return TRACE_RULES.filter(
    (r) =>
      r.sourceLayer === sourceLayerValue &&
      r.sourceTypes.includes(sourceTypeValue as ElementTypeValue),
  ).map((r) => ({
    type: r.type,
    typeLabelFa: r.typeLabelFa,
    targetLayer: r.targetLayer,
    targetLayerLabelFa: r.targetLayerLabelFa,
    targetTypes: r.targetTypes,
  }));
}
