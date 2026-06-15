import {
  ElementType,
  type ElementTypeValue,
} from "../value-objects/element-type";
import { Layer } from "../value-objects/layer";
import { RelationshipType } from "../value-objects/relationship-type";

interface ConnectionRule {
  relationshipType: string;
  allowedSources: ElementTypeValue[];
  allowedTargets: ElementTypeValue[];
  layer: Layer;
  descriptionFa: string;
}

const RULES: ConnectionRule[] = [
  // ─── OA ────────────────────────────────────────────────────────────────────
  {
    relationshipType: "OperationalExchange",
    layer: Layer.OA,
    allowedSources: ["OperationalActivity"],
    allowedTargets: ["OperationalActivity"],
    descriptionFa: "تبادل عملیاتی فقط بین فعالیت‌های عملیاتی مجاز است",
  },
  {
    relationshipType: "InvolvementLink",
    layer: Layer.OA,
    allowedSources: ["OperationalEntity", "OperationalActor"],
    allowedTargets: [
      "OperationalCapability",
      "OperationalActivity",
      "OperationalProcess",
    ],
    descriptionFa: "پیوند مشارکت بین موجودیت/بازیگر و قابلیت/فعالیت",
  },
  {
    relationshipType: "Composition",
    layer: Layer.OA,
    allowedSources: [
      "OperationalEntity",
      "OperationalActivity",
      "OperationalCapability",
    ],
    allowedTargets: [
      "OperationalEntity",
      "OperationalActivity",
      "OperationalCapability",
    ],
    descriptionFa: "ترکیب (والد-فرزندی) بین موجودیت‌ها/فعالیت‌ها/قابلیت‌ها",
  },
  // ─── SA ────────────────────────────────────────────────────────────────────
  {
    relationshipType: "FunctionalExchange",
    layer: Layer.SA,
    allowedSources: ["SystemFunction"],
    allowedTargets: ["SystemFunction"],
    descriptionFa: "تبادل تابعی فقط بین توابع سیستم",
  },
  {
    relationshipType: "SystemExchange",
    layer: Layer.SA,
    allowedSources: ["System", "SystemActor"],
    allowedTargets: ["System", "SystemActor"],
    descriptionFa: "تبادل سیستمی بین سیستم و بازیگران خارجی",
  },
  {
    relationshipType: "ComponentExchange",
    layer: Layer.SA,
    allowedSources: ["SystemComponent"],
    allowedTargets: ["SystemComponent"],
    descriptionFa: "تبادل مؤلفه بین مؤلفه‌های سیستم",
  },
  {
    relationshipType: "FunctionalExchange",
    layer: Layer.SA,
    allowedSources: ["SystemFunction"],
    allowedTargets: ["SystemComponent"],
    descriptionFa: "تخصیص تابع سیستم به مؤلفه سیستم",
  },
  // ─── LA ────────────────────────────────────────────────────────────────────
  {
    relationshipType: "LogicalExchange",
    layer: Layer.LA,
    allowedSources: ["LogicalFunction"],
    allowedTargets: ["LogicalFunction"],
    descriptionFa: "تبادل منطقی بین توابع منطقی",
  },
  {
    relationshipType: "ComponentExchange",
    layer: Layer.LA,
    allowedSources: ["LogicalComponent", "LogicalActor"],
    allowedTargets: ["LogicalComponent", "LogicalActor"],
    descriptionFa: "تبادل مؤلفه بین مؤلفه‌های منطقی",
  },
  {
    relationshipType: "ProvidedInterface",
    layer: Layer.LA,
    allowedSources: ["LogicalComponent"],
    allowedTargets: ["LogicalComponent"],
    descriptionFa: "رابط ارائه‌شده توسط مؤلفه منطقی",
  },
  {
    relationshipType: "RequiredInterface",
    layer: Layer.LA,
    allowedSources: ["LogicalComponent"],
    allowedTargets: ["LogicalComponent"],
    descriptionFa: "رابط مورد نیاز مؤلفه منطقی",
  },
  {
    relationshipType: "Composition",
    layer: Layer.LA,
    allowedSources: ["LogicalComponent", "LogicalActor"],
    allowedTargets: ["LogicalComponent", "LogicalActor"],
    descriptionFa: "ترکیب بین مؤلفه‌ها/بازیگران منطقی",
  },
  {
    relationshipType: "LogicalExchange",
    layer: Layer.LA,
    allowedSources: ["LogicalFunction"],
    allowedTargets: ["LogicalComponent"],
    descriptionFa: "تخصیص تابع منطقی به مؤلفه منطقی",
  },
  // ─── PA ────────────────────────────────────────────────────────────────────
  {
    relationshipType: "PhysicalExchange",
    layer: Layer.PA,
    allowedSources: ["PhysicalFunction"],
    allowedTargets: ["PhysicalFunction"],
    descriptionFa: "تبادل فیزیکی بین توابع فیزیکی",
  },
  {
    relationshipType: "PhysicalLink",
    layer: Layer.PA,
    allowedSources: ["PhysicalNode"],
    allowedTargets: ["PhysicalNode"],
    descriptionFa: "پیوند فیزیکی فقط بین گره‌های فیزیکی",
  },
  {
    relationshipType: "DeploymentLink",
    layer: Layer.PA,
    allowedSources: ["PhysicalComponent"],
    allowedTargets: ["PhysicalNode"],
    descriptionFa: "مؤلفه فیزیکی روی گره فیزیکی مستقر می‌شود",
  },
  {
    relationshipType: "Composition",
    layer: Layer.PA,
    allowedSources: ["PhysicalComponent", "PhysicalNode"],
    allowedTargets: ["PhysicalComponent", "PhysicalNode"],
    descriptionFa: "ترکیب بین مؤلفه‌ها/گره‌های فیزیکی",
  },
  {
    relationshipType: "PhysicalExchange",
    layer: Layer.PA,
    allowedSources: ["PhysicalFunction"],
    allowedTargets: ["PhysicalComponent"],
    descriptionFa: "تخصیص تابع فیزیکی به مؤلفه فیزیکی",
  },
];

/**
 * ConnectionPolicy
 *
 * Policy for validating a connection between two elements.
 * Open/Closed: Rules are extensible via the RULES array.
 * Single Responsibility: Only connection validation.
 */
export class ConnectionPolicy {
  /**
   * Checks whether the connection is allowed — throws an error if not.
   */
  static assertAllowed(
    sourceType: ElementType,
    targetType: ElementType,
    relationshipType: RelationshipType,
  ): void {
    const rule = RULES.find(
      (r) => r.relationshipType === relationshipType.value,
    );

    if (!rule) {
      throw new Error(
        `Relationship type "${relationshipType.value}" is not defined.`,
      );
    }

    if (!rule.allowedSources.includes(sourceType.value)) {
      throw new Error(
        `Source element "${sourceType.labelFa}" is not allowed for relationship "${relationshipType.labelFa}".`,
      );
    }

    if (!rule.allowedTargets.includes(targetType.value)) {
      throw new Error(
        `Target element "${targetType.labelFa}" is not allowed for relationship "${relationshipType.labelFa}".`,
      );
    }
  }

  /**
   * Returns the allowed relationship types between two element types.
   */
  static getAllowedTypes(
    sourceType: string | ElementType,
    targetType: string | ElementType,
  ): RelationshipType[] {
    return RULES.filter(
      (r) =>
        r.allowedSources.includes(
          ElementType.from(sourceType.toString()).value,
        ) &&
        r.allowedTargets.includes(
          ElementType.from(targetType.toString()).value,
        ),
    ).map((r) => RelationshipType.from(r.relationshipType));
  }

  /**
   * Checks without throwing an error.
   */
  static isAllowed(
    sourceType: ElementType,
    targetType: ElementType,
    relationshipType: RelationshipType,
  ): boolean {
    try {
      ConnectionPolicy.assertAllowed(sourceType, targetType, relationshipType);
      return true;
    } catch {
      return false;
    }
  }
}
