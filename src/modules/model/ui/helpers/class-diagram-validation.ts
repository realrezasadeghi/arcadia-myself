import type { ClassEdgeData, ClassNodeData } from "../stores/canvas";

export type ValidationSeverity = "error" | "warning" | "info";

export type ValidationIssue = {
  id: string;
  severity: ValidationSeverity;
  message: string;
  elementId?: string;
  edgeId?: string;
};

/**
 * Validates class diagram nodes and edges.
 * Returns a list of validation issues.
 */
export function validateClassDiagram(
  nodes: ClassNodeData[],
  edges: ClassEdgeData[],
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Validate nodes
  for (const node of nodes) {
    // Empty name
    if (!node.name || node.name.trim() === "") {
      issues.push({
        id: `empty-name-${node.elementId}`,
        severity: "error",
        message: "Element name cannot be empty",
        elementId: node.elementId,
      });
    }

    // Deprecated status warning
    if (node.status === "DEPRECATED") {
      issues.push({
        id: `deprecated-${node.elementId}`,
        severity: "warning",
        message: `"${node.name}" is deprecated`,
        elementId: node.elementId,
      });
    }

    // Interface without operations
    if (
      node.elementType === "INTERFACE" &&
      (!node.operations || node.operations.length === 0)
    ) {
      issues.push({
        id: `empty-interface-${node.elementType}-${node.elementId}`,
        severity: "info",
        message: `Interface "${node.name}" has no operations defined`,
        elementId: node.elementId,
      });
    }

    // Enum without literals
    if (
      node.elementType === "ENUM" &&
      (!node.enumerationLiterals || node.enumerationLiterals.length === 0)
    ) {
      issues.push({
        id: `empty-enum-${node.elementId}`,
        severity: "info",
        message: `Enumeration "${node.name}" has no literals defined`,
        elementId: node.elementId,
      });
    }

    // Class without attributes or operations
    if (
      node.elementType === "CLASS" &&
      (!node.properties || node.properties.length === 0) &&
      (!node.operations || node.operations.length === 0)
    ) {
      issues.push({
        id: `empty-class-${node.elementId}`,
        severity: "info",
        message: `Class "${node.name}" has no attributes or operations`,
        elementId: node.elementId,
      });
    }
  }

  // Validate edges
  for (const edge of edges) {
    // Generalization constraints
    if (edge.relationshipType === "GENERALIZATION") {
      if (edge.isDisjoint !== undefined && edge.isComplete !== undefined) {
        if (edge.isDisjoint && edge.isComplete) {
          issues.push({
            id: `disjoint-complete-${edge.relationshipId}`,
            severity: "warning",
            message:
              "Generalization is both disjoint and complete — unusual combination",
            edgeId: edge.relationshipId,
          });
        }
      }
    }

    // Association without role names
    if (edge.relationshipType === "ASSOCIATION") {
      if (!edge.sourceRole && !edge.targetRole) {
        issues.push({
          id: `unnamed-roles-${edge.relationshipId}`,
          severity: "info",
          message: "Association has no role names defined",
          edgeId: edge.relationshipId,
        });
      }
    }
  }

  return issues;
}

/**
 * Returns the validation issue count by severity for a given element.
 */
export function getElementValidationIssues(
  elementId: string,
  issues: ValidationIssue[],
): ValidationIssue[] {
  return issues.filter((issue) => issue.elementId === elementId);
}

/**
 * Returns the validation issue count by severity for a given edge.
 */
export function getEdgeValidationIssues(
  edgeId: string,
  issues: ValidationIssue[],
): ValidationIssue[] {
  return issues.filter((issue) => issue.edgeId === edgeId);
}
