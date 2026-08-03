import { CLASS_ELEMENT_TYPES, CLASS_RELATIONSHIP_TYPES, getClassElementTypeInfo, getClassRelationshipTypeInfo } from "../constants/class-diagram";
import type { ClassElementTypeValue, ClassRelationshipTypeValue } from "../types/class-diagram";
import type { RelationshipTypeValue } from "../types/relationship";

export function getNodeTypeForClassElement(type: ClassElementTypeValue): "class-node" {
  return "class-node";
}

export function getClassEdgeTypeForRelationship(type: ClassRelationshipTypeValue): "class-edge" {
  return "class-edge";
}

export function isClassDiagramElement(type: string): boolean {
  return CLASS_ELEMENT_TYPES.some((t) => t.value === type);
}

export function isClassDiagramRelationship(type: string): boolean {
  return CLASS_RELATIONSHIP_TYPES.some((t) => t.value === type);
}

export function getElementVisualForClass(type: ClassElementTypeValue) {
  const info = getClassElementTypeInfo(type);
  return {
    shape: info.shape,
    fillColor: info.color + "20",
    fillColorDark: info.color + "40",
    strokeColor: info.color,
  };
}

export function getRelationshipVisualForClass(type: ClassRelationshipTypeValue) {
  const info = getClassRelationshipTypeInfo(type);
  return {
    strokeColor: info.strokeColor,
    strokeWidth: info.strokeWidth,
    strokeDash: info.strokeDash,
    markerEnd: info.markerEnd,
  };
}

/**
 * Maps architecture RelationshipTypeValue to ClassRelationshipTypeValue.
 * Used when building edges for CDB diagrams from architecture relationship data.
 */
const ARCH_TO_CLASS_RELATIONSHIP: Record<string, ClassRelationshipTypeValue> = {
  Generalization: "GENERALIZATION",
  Composition: "ASSOCIATION",
  ProvidedInterface: "DEPENDENCY",
  RequiredInterface: "DEPENDENCY",
  FunctionalExchange: "DEPENDENCY",
  SystemExchange: "ASSOCIATION",
  LogicalExchange: "ASSOCIATION",
  ComponentExchange: "ASSOCIATION",
  PhysicalExchange: "ASSOCIATION",
  OperationalExchange: "ASSOCIATION",
  InvolvementLink: "DEPENDENCY",
  PhysicalLink: "ASSOCIATION",
  DeploymentLink: "ASSOCIATION",
};

export function mapToClassRelationshipType(
  type: RelationshipTypeValue,
): ClassRelationshipTypeValue {
  return ARCH_TO_CLASS_RELATIONSHIP[type] ?? "ASSOCIATION";
}