import { TRACE_RULES } from "../relationships/rules";
import {
  ElementType,
  type ElementTypeValue,
} from "../value-objects/element-type";
import { Layer, type LayerValue } from "../value-objects/layer";
import { TraceLinkType } from "../value-objects/trace-link";

/**
 * TracePolicy
 *
 * Cross-layer (and intra-layer) trace validation — a thin view over the shared
 * `TRACE_RULES` registry in `domain/relationships/rules.ts`.
 */
export class TracePolicy {
  static assertAllowed(
    sourceType: ElementType,
    sourceLayer: Layer,
    targetType: ElementType,
    targetLayer: Layer,
    traceLinkType: TraceLinkType,
  ): void {
    if (sourceType.equals(targetType) && sourceLayer.equals(targetLayer)) {
      throw new Error("An element can't trace to itself");
    }

    const rule = TRACE_RULES.find(
      (r) =>
        r.type === traceLinkType.value &&
        r.sourceLayer.equals(sourceLayer) &&
        r.targetLayer.equals(targetLayer) &&
        r.sourceTypes.includes(sourceType.value) &&
        r.targetTypes.includes(targetType.value),
    );

    if (!rule) {
      throw new Error(
        `"${traceLinkType.labelFa}" from "${sourceType.labelFa}" (${sourceLayer.labelFa}) to "${targetType.labelFa}" (${targetLayer.labelFa}) is not allowed.`,
      );
    }
  }

  static getTraceOptions(
    sourceType: string | ElementType,
    sourceLayer: LayerValue | Layer,
  ): Array<{
    targetTypes: ElementTypeValue[];
    targetLayer: Layer;
    type: TraceLinkType;
  }> {
    const type = ElementType.from(sourceType.toString());
    const layer = Layer.from(sourceLayer.toString());

    return TRACE_RULES.filter(
      (r) => r.sourceTypes.includes(type.value) && r.sourceLayer.equals(layer),
    ).map((r) => ({
      targetTypes: r.targetTypes,
      targetLayer: r.targetLayer,
      type: TraceLinkType.from(r.type),
    }));
  }

  static isAllowed(
    sourceType: ElementType,
    sourceLayer: Layer,
    targetType: ElementType,
    targetLayer: Layer,
    traceLinkType: TraceLinkType,
  ): boolean {
    try {
      TracePolicy.assertAllowed(
        sourceType,
        sourceLayer,
        targetType,
        targetLayer,
        traceLinkType,
      );
      return true;
    } catch {
      return false;
    }
  }
}
