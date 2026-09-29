import { ClassRelationshipType } from "../../domain/value-objects/class-relationship-type";
import type {
  ClassElementTypeValue,
  ClassRelationshipTypeValue,
} from "../types/class-diagram";

export const CLASS_ELEMENT_TYPES: {
  value: ClassElementTypeValue;
  label: string;
  labelFa: string;
  description: string;
  color: string;
  shape: "rectangle" | "rounded-rectangle" | "ellipse";
}[] = [
  {
    value: "CLASS",
    label: "Class",
    labelFa: "کلاس",
    description: "A standard UML class",
    color: "#2563EB",
    shape: "rectangle",
  },
  {
    value: "INTERFACE",
    label: "Interface",
    labelFa: "رابط",
    description: "A UML interface",
    color: "#16A34A",
    shape: "rectangle",
  },
  {
    value: "ENUM",
    label: "Enumeration",
    labelFa: "شمارش",
    description: "An enumeration type",
    color: "#9333EA",
    shape: "rectangle",
  },
  {
    value: "DATA_TYPE",
    label: "Data Type",
    labelFa: "نوع داده",
    description: "A data type",
    color: "#DC2626",
    shape: "rounded-rectangle",
  },
  {
    value: "PRIMITIVE",
    label: "Primitive",
    labelFa: "ابتدایی",
    description: "A primitive type",
    color: "#EA580C",
    shape: "rounded-rectangle",
  },
  {
    value: "COLLECTION",
    label: "Collection",
    labelFa: "مجموعه",
    description: "A collection type",
    color: "#0891B2",
    shape: "rounded-rectangle",
  },
  {
    value: "UNION",
    label: "Union",
    labelFa: "اتحاد",
    description: "A union type",
    color: "#CA8A04",
    shape: "rounded-rectangle",
  },
  {
    value: "PACKAGE",
    label: "Package",
    labelFa: "پکیج",
    description: "A UML package for organizing elements",
    color: "#6B7280",
    shape: "rectangle",
  },
];

/**
 * Visual spec only. `label` / `labelFa` / `description` are derived from the
 * domain `ClassRelationshipType` registry so both layers stay in sync.
 */
const CLASS_RELATIONSHIP_VISUALS: Record<
  ClassRelationshipTypeValue,
  {
    strokeColor: string;
    strokeWidth: number;
    strokeDash?: string;
    markerEnd?: string;
  }
> = {
  ASSOCIATION: {
    strokeColor: "#475569",
    strokeWidth: 1.5,
  },
  GENERALIZATION: {
    strokeColor: "#2563EB",
    strokeWidth: 1.5,
    markerEnd: "generalization",
  },
  REALIZATION: {
    strokeColor: "#7C3AED",
    strokeWidth: 1.5,
    strokeDash: "6,3",
    markerEnd: "realization",
  },
  DEPENDENCY: {
    strokeColor: "#94A3B8",
    strokeWidth: 1,
    strokeDash: "4,3",
  },
};

export const CLASS_RELATIONSHIP_TYPES: {
  value: ClassRelationshipTypeValue;
  label: string;
  labelFa: string;
  description: string;
  strokeColor: string;
  strokeWidth: number;
  strokeDash?: string;
  markerEnd?: string;
}[] = (
  Object.keys(CLASS_RELATIONSHIP_VISUALS) as ClassRelationshipTypeValue[]
).map((value) => {
  const meta = ClassRelationshipType.from(value);
  return {
    value,
    label: meta.label,
    labelFa: meta.labelFa,
    description: meta.description,
    ...CLASS_RELATIONSHIP_VISUALS[value],
  };
});

export const AGGREGATION_KIND_INFO: Record<
  "NONE" | "SHARED" | "COMPOSITE",
  { label: string; labelFa: string; description: string }
> = {
  NONE: { label: "None", labelFa: "بدون", description: "No aggregation" },
  SHARED: {
    label: "Shared",
    labelFa: "مشترک",
    description: "Aggregation (hollow diamond)",
  },
  COMPOSITE: {
    label: "Composite",
    labelFa: "ترکیبی",
    description: "Composition (filled diamond)",
  },
};

export const CLASS_VISIBILITY_INFO: Record<
  "public" | "private" | "protected" | "package",
  { symbol: string; label: string; labelFa: string }
> = {
  public: { symbol: "+", label: "Public", labelFa: "عمومی" },
  private: { symbol: "-", label: "Private", labelFa: "خصوصی" },
  protected: { symbol: "#", label: "Protected", labelFa: "محافظت‌شده" },
  package: { symbol: "~", label: "Package", labelFa: "پکیج" },
};

export function getClassElementTypeInfo(type: ClassElementTypeValue) {
  return (
    CLASS_ELEMENT_TYPES.find((t) => t.value === type) ?? CLASS_ELEMENT_TYPES[0]
  );
}

export function getClassRelationshipTypeInfo(type: ClassRelationshipTypeValue) {
  return (
    CLASS_RELATIONSHIP_TYPES.find((t) => t.value === type) ??
    CLASS_RELATIONSHIP_TYPES[0]
  );
}

export function getVisibilitySymbol(
  visibility: "public" | "private" | "protected" | "package",
): string {
  return CLASS_VISIBILITY_INFO[visibility]?.symbol ?? "+";
}

export function formatMultiplicity(lower: number, upper: string): string {
  if (lower === 1 && upper === "1") return "";
  if (lower === 0 && upper === "*") return "0..*";
  if (String(lower) === upper) return `${lower}`;
  return `${lower}..${upper}`;
}
