import { ClassElementType, type ClassElementTypeValue } from "../value-objects/class-element-type";
import { ClassRelationshipType, type ClassRelationshipTypeValue } from "../value-objects/class-relationship-type";
import { Layer, type LayerValue } from "../value-objects/layer";

export type ValidationSeverity = "error" | "warning" | "info";

export type ValidationIssue = {
  id: string;
  severity: ValidationSeverity;
  rule: string;
  message: string;
  elementId?: string;
  elementName?: string;
  elementType?: string;
  relationshipId?: string;
  layer?: LayerValue;
};

type ValidationContext = {
  elements: Array<{
    id: string;
    modelId: string;
    layer: string;
    type: string;
    name: string;
    isAbstract: boolean;
    isStatic: boolean;
    parentId: string | null;
    status: string;
  }>;
  relationships: Array<{
    id: string;
    modelId: string;
    layer: string;
    sourceElementId: string;
    targetElementId: string;
    relationshipType: string;
    isAggregate: boolean;
    isComposite: boolean;
    sourceMultiplicityLower: number;
    sourceMultiplicityUpper: string;
    targetMultiplicityLower: number;
    targetMultiplicityUpper: string;
    isNavigableSource: boolean;
    isNavigableTarget: boolean;
    status: string;
  }>;
};

/**
 * ClassDiagramPolicy — structural validation for class diagrams.
 *
 * Implements Capella/ARCADIA validation rules for UML class diagrams.
 */
export class ClassDiagramPolicy {
  static validate(ctx: ValidationContext): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    let issueCounter = 0;
    const nextId = () => `val-${++issueCounter}`;

    const elementById = new Map(ctx.elements.map((e) => [e.id, e]));
    const elementsByLayer = new Map<string, typeof ctx.elements>();
    for (const el of ctx.elements) {
      const arr = elementsByLayer.get(el.layer) ?? [];
      arr.push(el);
      elementsByLayer.set(el.layer, arr);
    }

    // Rule 1: Abstract classes must be CLASS type
    for (const el of ctx.elements) {
      if (el.isAbstract && el.type !== "CLASS") {
        issues.push({
          id: nextId(),
          severity: "error",
          rule: "abstract-only-class",
          message: `Only CLASS elements can be abstract; "${el.name}" is ${el.type}`,
          elementId: el.id,
          elementName: el.name,
          elementType: el.type,
          layer: el.layer as LayerValue,
        });
      }
    }

    // Rule 2: No cycles in GENERALIZATION
    const genGraph = new Map<string, string[]>();
    for (const rel of ctx.relationships) {
      if (rel.relationshipType === "GENERALIZATION") {
        const arr = genGraph.get(rel.sourceElementId) ?? [];
        arr.push(rel.targetElementId);
        genGraph.set(rel.sourceElementId, arr);
      }
    }
    for (const [source, targets] of genGraph) {
      const visited = new Set<string>();
      const stack = [...targets];
      while (stack.length > 0) {
        const current = stack.pop()!;
        if (current === source) {
          const srcEl = elementById.get(source);
          issues.push({
            id: nextId(),
            severity: "error",
            rule: "generalization-cycle",
            message: `Generalization cycle detected involving "${srcEl?.name ?? source}"`,
            elementId: source,
            elementName: srcEl?.name,
            elementType: srcEl?.type,
            layer: srcEl?.layer as LayerValue,
          });
          break;
        }
        if (visited.has(current)) continue;
        visited.add(current);
        const nextTargets = genGraph.get(current);
        if (nextTargets) stack.push(...nextTargets);
      }
    }

    // Rule 3: REALIZATION target must be INTERFACE
    for (const rel of ctx.relationships) {
      if (rel.relationshipType === "REALIZATION") {
        const target = elementById.get(rel.targetElementId);
        if (target && target.type !== "INTERFACE") {
          issues.push({
            id: nextId(),
            severity: "error",
            rule: "realization-target-interface",
            message: `REALIZATION target must be INTERFACE; "${target.name}" is ${target.type}`,
            relationshipId: rel.id,
            elementId: rel.targetElementId,
            elementName: target.name,
            elementType: target.type,
            layer: target.layer as LayerValue,
          });
        }
      }
    }

    // Rule 4: ENUM must have at least one literal (checked elsewhere via hasLiterals)

    // Rule 5: COMPOSITION implies AGGREGATION flag
    for (const rel of ctx.relationships) {
      if (rel.isComposite && !rel.isAggregate) {
        issues.push({
          id: nextId(),
          severity: "error",
          rule: "composition-implies-aggregation",
          message: `COMPOSITION relationship must have isAggregate=true`,
          relationshipId: rel.id,
          elementId: rel.sourceElementId,
          layer: rel.layer as LayerValue,
        });
      }
    }

    // Rule 6: Multiplicity consistency - upper bound >= lower bound (when numeric)
    for (const rel of ctx.relationships) {
      const checkMultiplicity = (
        lower: number,
        upper: string,
        side: "source" | "target"
      ) => {
        if (upper !== "*" && !isNaN(Number(upper))) {
          const upperNum = Number(upper);
          if (upperNum < lower) {
            issues.push({
              id: nextId(),
              severity: "warning",
              rule: "multiplicity-upper-lower",
              message: `${side} multiplicity upper (${upper}) < lower (${lower})`,
              relationshipId: rel.id,
              layer: rel.layer as LayerValue,
            });
          }
        }
      };
      checkMultiplicity(
        rel.sourceMultiplicityLower,
        rel.sourceMultiplicityUpper,
        "source"
      );
      checkMultiplicity(
        rel.targetMultiplicityLower,
        rel.targetMultiplicityUpper,
        "target"
      );
    }

    // Rule 7: Orphan elements (no relationships, no parent, not on any diagram)
    // Note: diagram layout check would require diagram context; here we only check relationships
    const elementsWithRels = new Set<string>();
    for (const rel of ctx.relationships) {
      elementsWithRels.add(rel.sourceElementId);
      elementsWithRels.add(rel.targetElementId);
    }
    for (const el of ctx.elements) {
      if (!elementsWithRels.has(el.id) && el.parentId === null) {
        issues.push({
          id: nextId(),
          severity: "warning",
          rule: "orphan-element",
          message: `Element "${el.name}" has no relationships and no parent decomposition`,
          elementId: el.id,
          elementName: el.name,
          elementType: el.type,
          layer: el.layer as LayerValue,
        });
      }
    }

    // Rule 8: Duplicate names within same model+layer
    const namesSeen = new Map<string, string[]>();
    for (const el of ctx.elements) {
      const key = `${el.modelId}:${el.layer}:${el.name.toLowerCase()}`;
      const arr = namesSeen.get(key) ?? [];
      arr.push(el.id);
      namesSeen.set(key, arr);
    }
    for (const [, ids] of namesSeen) {
      if (ids.length > 1) {
        for (const id of ids) {
          const el = elementById.get(id);
          if (el) {
            issues.push({
              id: nextId(),
              severity: "warning",
              rule: "duplicate-name",
              message: `Duplicate element name "${el.name}" in this model/layer`,
              elementId: el.id,
              elementName: el.name,
              elementType: el.type,
              layer: el.layer as LayerValue,
            });
          }
        }
      }
    }

    // Rule 9: Interface cannot be source of COMPOSITION/AGGREGATION (Capella rule)
    for (const rel of ctx.relationships) {
      if (
        (rel.relationshipType === "COMPOSITION" ||
          rel.relationshipType === "AGGREGATION") &&
        rel.isAggregate
      ) {
        const source = elementById.get(rel.sourceElementId);
        if (source && source.type === "INTERFACE") {
          issues.push({
            id: nextId(),
            severity: "error",
            rule: "interface-no-composition",
            message: `INTERFACE "${source.name}" cannot be the whole in AGGREGATION/COMPOSITION`,
            relationshipId: rel.id,
            elementId: source.id,
            elementName: source.name,
            elementType: source.type,
            layer: source.layer as LayerValue,
          });
        }
      }
    }

    // Rule 10: Empty name validation
    for (const el of ctx.elements) {
      if (!el.name.trim()) {
        issues.push({
          id: nextId(),
          severity: "error",
          rule: "empty-name",
          message: "Element name is required",
          elementId: el.id,
          elementType: el.type,
          layer: el.layer as LayerValue,
        });
      }
    }

    return issues;
  }
}