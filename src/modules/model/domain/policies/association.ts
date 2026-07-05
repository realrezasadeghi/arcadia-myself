import type { ClassAssociationType } from "../entities/class-association";
import type { ElementTypeValue } from "../value-objects/element-type";

export type AssociationValidationResult = {
  isValid: boolean;
  errors: string[];
};

type AssociationRule = {
  type: ClassAssociationType;
  description: string;
  validate: (context: AssociationValidationContext) => string | null;
};

type AssociationValidationContext = {
  sourceType: ElementTypeValue;
  targetType: ElementTypeValue;
  associationType: ClassAssociationType;
};

const RULES: AssociationRule[] = [
  {
    type: "ClassGeneralization",
    description:
      "Generalization source and target must both be Class or both Interface",
    validate: (ctx) => {
      const sourceIsClass = ctx.sourceType === "Class";
      const targetIsClass = ctx.targetType === "Class";
      const sourceIsInterface = ctx.sourceType === "Interface";
      const targetIsInterface = ctx.targetType === "Interface";

      if (
        (sourceIsClass && targetIsClass) ||
        (sourceIsInterface && targetIsInterface)
      ) {
        return null;
      }
      return "Generalization must be between same element types (Class→Class or Interface→Interface)";
    },
  },
  {
    type: "ClassRealization",
    description:
      "Realization source must be Class/Component, target must be Interface",
    validate: (ctx) => {
      const validSource =
        ctx.sourceType === "Class" ||
        ctx.sourceType === "SystemComponent" ||
        ctx.sourceType === "LogicalComponent" ||
        ctx.sourceType === "PhysicalComponent";
      const validTarget = ctx.targetType === "Interface";

      if (validSource && validTarget) return null;
      return "Realization must be from Class/Component to Interface";
    },
  },
  {
    type: "ClassComposition",
    description: "Composition target cannot be the same as source (no cycles)",
    validate: (_ctx) => {
      // Cycle detection is done at a higher level with the full graph
      return null;
    },
  },
  {
    type: "ClassDependency",
    description: "Dependency is allowed between any information types",
    validate: (_ctx) => {
      return null;
    },
  },
  {
    type: "ClassAssociation",
    description: "Association is allowed between any class-like types",
    validate: (_ctx) => {
      return null;
    },
  },
  {
    type: "ClassAggregation",
    description: "Aggregation is allowed between any class-like types",
    validate: (_ctx) => {
      return null;
    },
  },
];

/**
 * AssociationPolicy — Business Rules
 *
 * Validates whether a class association can be created between two elements.
 */
export class AssociationPolicy {
  static validate(
    context: AssociationValidationContext,
  ): AssociationValidationResult {
    const errors: string[] = [];

    // Check type-specific rules
    for (const rule of RULES) {
      if (rule.type === context.associationType) {
        const error = rule.validate(context);
        if (error) errors.push(error);
      }
    }

    // General: cannot create duplicate association (same type, source, target)
    // This is checked at the repository level

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /** Check if generalization chain would create a cycle */
  static wouldCreateCycle(
    sourceId: string,
    targetId: string,
    existingGeneralizations: Array<{
      sourceClassId: string;
      targetClassId: string;
    }>,
  ): boolean {
    // DFS from target to see if we can reach source
    const visited = new Set<string>();
    const stack = [targetId];

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (current === sourceId) return true;
      if (visited.has(current)) continue;
      visited.add(current);

      for (const gen of existingGeneralizations) {
        if (gen.sourceClassId === current) {
          stack.push(gen.targetClassId);
        }
      }
    }

    return false;
  }
}
