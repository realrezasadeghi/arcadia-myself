import { DIAGRAM_TYPES } from "../constants/diagram";
import type { DiagramTypeInfo, DiagramTypeValue } from "../types/diagram";
import type { ElementTypeValue } from "../types/element";
import type { LayerValue } from "../types/layer";
import type { RelationshipTypeValue } from "../types/relationship";
import { getElementTypesForLayer } from "./element";

export function getDiagramTypeInfo(value: string): DiagramTypeInfo | undefined {
  return DIAGRAM_TYPES.find((d) => d.value === value);
}

export function getDiagramTypesForLayer(
  layerValue: LayerValue | string,
): DiagramTypeInfo[] {
  return DIAGRAM_TYPES.filter((d) => d.layer === layerValue);
}

export function getDiagramLayer(typeValue: string): LayerValue {
  return getDiagramTypeInfo(typeValue)?.layer ?? "OA";
}

// ─── Per-diagram-type palette (Capella-style toolboxes) ───────────────────────

export type DiagramPalette = {
  elementTypes: string[];
  relationshipTypes: string[];
};

/**
 * هر نوع دیاگرام Arcadia ابزارهای مخصوص خود را دارد (مثلاً SAB با SDFB فرق دارد).
 * این نگاشت زیرمجموعه‌ی المنت‌ها و روابط مرتبط با هر نوع دیاگرام را تعریف می‌کند.
 */
const DIAGRAM_PALETTE: Record<DiagramTypeValue, DiagramPalette> = {
  // ─── OA ───
  OEB: {
    elementTypes: ["OperationalEntity", "OperationalActor"],
    relationshipTypes: ["Composition"],
  },
  OAB: {
    elementTypes: ["OperationalActivity"],
    relationshipTypes: ["Composition"],
  },
  OPD: {
    elementTypes: ["OperationalActivity", "OperationalProcess"],
    relationshipTypes: ["OperationalExchange"],
  },
  OCD: {
    elementTypes: [
      "OperationalCapability",
      "OperationalEntity",
      "OperationalActor",
      "OperationalActivity",
    ],
    relationshipTypes: ["InvolvementLink"],
  },
  OIS: {
    elementTypes: [
      "OperationalEntity",
      "OperationalActor",
      "OperationalActivity",
    ],
    relationshipTypes: ["OperationalExchange"],
  },
  // ─── SA ───
  SAB: {
    elementTypes: [
      "System",
      "SystemActor",
      "SystemComponent",
      "SystemFunction",
    ],
    relationshipTypes: ["SystemExchange", "FunctionalExchange"],
  },
  SDFB: {
    elementTypes: ["SystemFunction", "FunctionPort"],
    relationshipTypes: ["FunctionalExchange"],
  },
  SCD: {
    elementTypes: ["SystemCapability", "SystemActor", "SystemFunction"],
    relationshipTypes: ["InvolvementLink"],
  },
  SS: {
    elementTypes: ["SystemActor", "SystemFunction"],
    relationshipTypes: ["FunctionalExchange"],
  },
  // ─── LA ───
  LAB: {
    elementTypes: ["LogicalComponent", "LogicalActor", "LogicalFunction"],
    relationshipTypes: ["ComponentExchange", "FunctionalExchange"],
  },
  LDFB: {
    elementTypes: ["LogicalFunction"],
    relationshipTypes: ["LogicalExchange", "FunctionalExchange"],
  },
  LCB: {
    elementTypes: ["LogicalComponent"],
    relationshipTypes: ["Composition"],
  },
  LS: {
    elementTypes: ["LogicalActor", "LogicalFunction"],
    relationshipTypes: ["LogicalExchange"],
  },
  // ─── PA ───
  PAB: {
    elementTypes: [
      "PhysicalComponent",
      "PhysicalNode",
      "PhysicalActor",
      "PhysicalFunction",
    ],
    relationshipTypes: ["PhysicalExchange", "PhysicalLink"],
  },
  PDFB: {
    elementTypes: ["PhysicalFunction"],
    relationshipTypes: ["PhysicalExchange"],
  },
  PCB: {
    elementTypes: ["PhysicalComponent", "PhysicalNode"],
    relationshipTypes: ["Composition", "DeploymentLink"],
  },
  PS: {
    elementTypes: ["PhysicalActor", "PhysicalFunction"],
    relationshipTypes: ["PhysicalExchange"],
  },
  EPBB: {
    elementTypes: [
      "EPBSArchitecture",
      "ConfigurationItem",
      "ConfigurationItemPart",
      "ConfigurationItemInterface",
    ],
    relationshipTypes: ["Composition", "ProvidedInterface", "RequiredInterface", "Generalization"],
  },
  EAB: {
    elementTypes: [
      "EPBSArchitecture",
      "ConfigurationItem",
      "ConfigurationItemPart",
      "ConfigurationItemInterface",
    ],
    relationshipTypes: ["Composition", "ProvidedInterface", "RequiredInterface", "Generalization"],
  },
  ECB: {
    elementTypes: [
      "ConfigurationItem",
      "ConfigurationItemPart",
      "ConfigurationItemInterface",
    ],
    relationshipTypes: ["ProvidedInterface", "RequiredInterface", "Generalization"],
  },
  // ─── Class Diagram (CDB) ───
  CDB: {
    elementTypes: ["CLASS", "INTERFACE", "ENUM", "DATA_TYPE", "PRIMITIVE", "COLLECTION", "UNION", "PACKAGE", "GROUP"],
    relationshipTypes: ["ASSOCIATION", "GENERALIZATION", "REALIZATION", "DEPENDENCY"],
  },
};

/**
 * پالت یک نوع دیاگرام را برمی‌گرداند. المنت‌ها به نوع‌های معتبرِ همان لایه فیلتر
 * می‌شوند و در صورت نبود نگاشت، به همه‌ی نوع‌های لایه برمی‌گردد (fallback).
 * برای Class Diagram (CDB) نگاشت اختصاصی دارد.
 */
export function getDiagramPalette(typeValue: string): DiagramPalette {
  const layer = getDiagramLayer(typeValue);
  
  // Class Diagram (CDB) uses its own element types, not layer-based ones
  if (typeValue === "CDB") {
    const palette = DIAGRAM_PALETTE.CDB;
    return {
      elementTypes: palette.elementTypes,
      relationshipTypes: palette.relationshipTypes,
    };
  }

  const validTypes = new Set<string>(
    getElementTypesForLayer(layer).map((e) => e.value),
  );

  const palette = DIAGRAM_PALETTE[typeValue as DiagramTypeValue];
  if (!palette) {
    return {
      elementTypes: [...validTypes] as string[],
      relationshipTypes: [],
    };
  }

  return {
    elementTypes: palette.elementTypes.filter((t) => validTypes.has(t)) as string[],
    relationshipTypes: palette.relationshipTypes,
  };
}
