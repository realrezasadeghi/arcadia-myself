import { ClassRelationshipType } from "../value-objects/class-relationship-type";
import { ClassElementType } from "../value-objects/class-element-type";

interface ConnectionRule {
  relationshipType: string;
  allowedSourceTypes: string[];
  allowedTargetTypes: string[];
  description: string;
}

const RULES: ConnectionRule[] = [
  // GENERALIZATION: Class -> Class (or Interface -> Interface, Class -> Interface)
  {
    relationshipType: "GENERALIZATION",
    allowedSourceTypes: ["CLASS", "INTERFACE", "ENUM", "DATA_TYPE"],
    allowedTargetTypes: ["CLASS", "INTERFACE", "ENUM", "DATA_TYPE"],
    description: "Generalization between classifiers",
  },
  // REALIZATION: Class -> Interface
  {
    relationshipType: "REALIZATION",
    allowedSourceTypes: ["CLASS", "ENUM", "DATA_TYPE"],
    allowedTargetTypes: ["INTERFACE"],
    description: "Class implements Interface",
  },
  // ASSOCIATION (plain): Any -> Any
  {
    relationshipType: "ASSOCIATION",
    allowedSourceTypes: [
      "CLASS",
      "INTERFACE",
      "ENUM",
      "DATA_TYPE",
      "PRIMITIVE",
    ],
    allowedTargetTypes: [
      "CLASS",
      "INTERFACE",
      "ENUM",
      "DATA_TYPE",
      "PRIMITIVE",
    ],
    description: "Structural association between classifiers",
  },
  // DEPENDENCY: Any -> Any
  {
    relationshipType: "DEPENDENCY",
    allowedSourceTypes: [
      "CLASS",
      "INTERFACE",
      "ENUM",
      "DATA_TYPE",
      "PRIMITIVE",
    ],
    allowedTargetTypes: [
      "CLASS",
      "INTERFACE",
      "ENUM",
      "DATA_TYPE",
      "PRIMITIVE",
    ],
    description: "Usage/dependency relationship",
  },
];

/**
 * ClassConnectionPolicy
 *
 * Validates whether a connection between two ClassElements is allowed
 * based on their types and the relationship type.
 */
export class ClassConnectionPolicy {
  static assertAllowed(
    sourceType: ClassElementType,
    targetType: ClassElementType,
    relationshipType: ClassRelationshipType,
  ): void {
    const rule = RULES.find(
      (r) =>
        r.relationshipType === relationshipType.value &&
        r.allowedSourceTypes.includes(sourceType.value) &&
        r.allowedTargetTypes.includes(targetType.value),
    );

    if (!rule) {
      throw new Error(
        `Connection from "${sourceType.label}" to "${targetType.label}" ` +
          `via "${relationshipType.label}" is not allowed.`,
      );
    }
  }

  static getAllowedRelationshipTypes(
    sourceType: string | ClassElementType,
    targetType: string | ClassElementType,
  ): ClassRelationshipType[] {
    const source =
      sourceType instanceof ClassElementType
        ? sourceType
        : ClassElementType.from(sourceType.toString());
    const target =
      targetType instanceof ClassElementType
        ? targetType
        : ClassElementType.from(targetType.toString());

    return RULES.filter(
      (r) =>
        r.allowedSourceTypes.includes(source.value) &&
        r.allowedTargetTypes.includes(target.value),
    ).map((r) => ClassRelationshipType.from(r.relationshipType));
  }

  static isAllowed(
    sourceType: ClassElementType,
    targetType: ClassElementType,
    relationshipType: ClassRelationshipType,
  ): boolean {
    try {
      ClassConnectionPolicy.assertAllowed(
        sourceType,
        targetType,
        relationshipType,
      );
      return true;
    } catch {
      return false;
    }
  }
}
