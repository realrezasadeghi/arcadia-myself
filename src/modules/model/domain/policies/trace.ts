import {
  ElementType,
  type ElementTypeValue,
} from "../value-objects/element-type";
import { Layer, type LayerValue } from "../value-objects/layer";
import { TraceLinkType } from "../value-objects/trace-link";

interface TraceRule {
  type: string;
  sourceTypes: ElementTypeValue[];
  sourceLayer: Layer;
  targetTypes: ElementTypeValue[];
  targetLayer: Layer;
  descriptionFa: string;
}

const RULES: TraceRule[] = [
  // ─── SA realizes OA ────────────────────────────────────────────────────────
  {
    type: "Realization",
    sourceLayer: Layer.SA,
    sourceTypes: ["SystemFunction"],
    targetLayer: Layer.OA,
    targetTypes: ["OperationalActivity"],
    descriptionFa: "تابع سیستم، فعالیت عملیاتی را محقق می‌کند",
  },
  {
    type: "Realization",
    sourceLayer: Layer.SA,
    sourceTypes: ["SystemActor"],
    targetLayer: Layer.OA,
    targetTypes: ["OperationalEntity", "OperationalActor"],
    descriptionFa: "بازیگر سیستم، موجودیت عملیاتی را محقق می‌کند",
  },
  {
    type: "Realization",
    sourceLayer: Layer.SA,
    sourceTypes: ["SystemCapability"],
    targetLayer: Layer.OA,
    targetTypes: ["OperationalCapability"],
    descriptionFa: "قابلیت سیستم، قابلیت عملیاتی را محقق می‌کند",
  },
  // ─── LA realizes SA ────────────────────────────────────────────────────────
  {
    type: "Realization",
    sourceLayer: Layer.LA,
    sourceTypes: ["LogicalFunction"],
    targetLayer: Layer.SA,
    targetTypes: ["SystemFunction"],
    descriptionFa: "تابع منطقی، تابع سیستم را محقق می‌کند",
  },
  {
    type: "Realization",
    sourceLayer: Layer.LA,
    sourceTypes: ["LogicalComponent"],
    targetLayer: Layer.SA,
    targetTypes: ["SystemComponent"],
    descriptionFa: "مؤلفه منطقی، مؤلفه سیستم را محقق می‌کند",
  },
  {
    type: "Realization",
    sourceLayer: Layer.LA,
    sourceTypes: ["LogicalActor"],
    targetLayer: Layer.SA,
    targetTypes: ["SystemActor"],
    descriptionFa: "بازیگر منطقی، بازیگر سیستم را محقق می‌کند",
  },
  // ─── PA realizes LA ────────────────────────────────────────────────────────
  {
    type: "Realization",
    sourceLayer: Layer.PA,
    sourceTypes: ["PhysicalComponent"],
    targetLayer: Layer.LA,
    targetTypes: ["LogicalComponent"],
    descriptionFa: "مؤلفه فیزیکی، مؤلفه منطقی را محقق می‌کند",
  },
  {
    type: "Realization",
    sourceLayer: Layer.PA,
    sourceTypes: ["PhysicalFunction"],
    targetLayer: Layer.LA,
    targetTypes: ["LogicalFunction"],
    descriptionFa: "تابع فیزیکی، تابع منطقی را محقق می‌کند",
  },
  {
    type: "Realization",
    sourceLayer: Layer.PA,
    sourceTypes: ["PhysicalActor"],
    targetLayer: Layer.LA,
    targetTypes: ["LogicalActor"],
    descriptionFa: "بازیگر فیزیکی، بازیگر منطقی را محقق می‌کند",
  },
  // ─── Allocation (درون لایه) ────────────────────────────────────────────────
  {
    type: "Allocation",
    sourceLayer: Layer.LA,
    sourceTypes: ["LogicalFunction"],
    targetLayer: Layer.LA,
    targetTypes: ["LogicalComponent"],
    descriptionFa: "تابع منطقی به مؤلفه منطقی تخصیص می‌یابد",
  },
  {
    type: "Allocation",
    sourceLayer: Layer.PA,
    sourceTypes: ["PhysicalFunction"],
    targetLayer: Layer.PA,
    targetTypes: ["PhysicalComponent"],
    descriptionFa: "تابع فیزیکی به مؤلفه فیزیکی تخصیص می‌یابد",
  },
  // ─── Deployment ────────────────────────────────────────────────────────────
  {
    type: "Deployment",
    sourceLayer: Layer.PA,
    sourceTypes: ["PhysicalComponent"],
    targetLayer: Layer.PA,
    targetTypes: ["PhysicalNode"],
    descriptionFa: "مؤلفه فیزیکی روی گره استقرار می‌یابد",
  },
  // ─── Involvement ───────────────────────────────────────────────────────────
  {
    type: "Involvement",
    sourceLayer: Layer.OA,
    sourceTypes: ["OperationalEntity", "OperationalActor"],
    targetLayer: Layer.OA,
    targetTypes: ["OperationalCapability"],
    descriptionFa: "موجودیت در قابلیت عملیاتی مشارکت دارد",
  },
  // ─── EPBS realizes PA ─────────────────────────────────────────────────────
  {
    type: "Realization",
    sourceLayer: Layer.EPBS,
    sourceTypes: ["ConfigurationItem"],
    targetLayer: Layer.PA,
    targetTypes: ["PhysicalComponent", "PhysicalActor"],
    descriptionFa: "مورد پیکربندی، مؤلفه فیزیکی یا بازیگر فیزیکی را محقق می‌کند",
  },
  // ─── EPBS Owned (parent breakdown) ──────────────────────────────────────
  {
    type: "Owned",
    sourceLayer: Layer.EPBS,
    sourceTypes: ["ConfigurationItem", "ConfigurationItemPart"],
    targetLayer: Layer.EPBS,
    targetTypes: ["ConfigurationItem", "ConfigurationItemPart"],
    descriptionFa: "مورد پیکربندی یا بخش آن، زیرمجموعه است",
  },
];

export class TracePolicy {
  /** بررسی می‌کند آیا trace مجاز است — در صورت عدم مجاز بودن خطا پرتاب می‌کند */
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

    const rule = RULES.find(
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

  /** گزینه‌های قابل trace برای یک المنت */
  static getTraceOptions(
    sourceType: string | ElementType,
    sourceLayer: LayerValue | Layer,
  ): Array<{
    targetTypes: ElementTypeValue[];
    targetLayer: Layer;
    type: TraceLinkType;
  }> {
    return RULES.filter(
      (r) =>
        r.sourceTypes.includes(ElementType.from(sourceType.toString()).value) &&
        r.sourceLayer.equals(Layer.from(sourceLayer.toString())),
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
