import { ValueObject } from "@/modules/shared/domain/value-object";
import type { RelationshipMeta } from "../types/relationship";

export type RelationshipTypeValue =
  | "OperationalExchange"
  | "InvolvementLink"
  | "FunctionalExchange"
  | "SystemExchange"
  | "LogicalExchange"
  | "ComponentExchange"
  | "ProvidedInterface"
  | "RequiredInterface"
  | "PhysicalExchange"
  | "PhysicalLink"
  | "DeploymentLink"
  | "Composition"
  | "ClassAssociation"
  | "ClassAggregation"
  | "ClassComposition"
  | "ClassGeneralization"
  | "ClassDependency"
  | "ClassRealization";

export type TraceLinkTypeValue =
  | "Realization"
  | "Allocation"
  | "Deployment"
  | "Involvement"
  | "Refinement";

const RELATIONSHIP_META: Record<RelationshipTypeValue, RelationshipMeta> = {
  OperationalExchange: {
    label: "Operational Exchange",
    labelFa: "تبادل عملیاتی",
  },
  InvolvementLink: { label: "Involvement Link", labelFa: "پیوند مشارکت" },
  FunctionalExchange: { label: "Functional Exchange", labelFa: "تبادل تابعی" },
  SystemExchange: { label: "System Exchange", labelFa: "تبادل سیستمی" },
  LogicalExchange: { label: "Logical Exchange", labelFa: "تبادل منطقی" },
  ComponentExchange: { label: "Component Exchange", labelFa: "تبادل مؤلفه" },
  ProvidedInterface: { label: "Provided Interface", labelFa: "رابط ارائه‌شده" },
  RequiredInterface: { label: "Required Interface", labelFa: "رابط مورد نیاز" },
  PhysicalExchange: { label: "Physical Exchange", labelFa: "تبادل فیزیکی" },
  PhysicalLink: { label: "Physical Link", labelFa: "پیوند فیزیکی" },
  DeploymentLink: { label: "Deployment Link", labelFa: "پیوند استقرار" },
  Composition: { label: "Composition", labelFa: "ترکیب" },
  ClassAssociation: {
    label: "Association",
    labelFa: "ارتباط",
  },
  ClassAggregation: {
    label: "Aggregation",
    labelFa: "تراکم",
  },
  ClassComposition: {
    label: "Composition",
    labelFa: "ترکیب کلاسی",
  },
  ClassGeneralization: {
    label: "Generalization",
    labelFa: "تعمیم",
  },
  ClassDependency: {
    label: "Dependency",
    labelFa: "وابستگی",
  },
  ClassRealization: {
    label: "Realization",
    labelFa: "تحقق",
  },
};

/** Class diagram relationship types */
const CLASS_RELATIONSHIP_TYPES: ReadonlySet<RelationshipTypeValue> = new Set([
  "ClassAssociation",
  "ClassAggregation",
  "ClassComposition",
  "ClassGeneralization",
  "ClassDependency",
  "ClassRealization",
]);

const ALL_RELATIONSHIP_VALUES = Object.keys(
  RELATIONSHIP_META,
) as RelationshipTypeValue[];

interface RelationshipTypeProps {
  value: RelationshipTypeValue;
}

/**
 * RelationshipType — Value Object
 *
 * Relationship types for all Arcadia layers and class diagrams.
 */
export class RelationshipType extends ValueObject<RelationshipTypeProps> {
  protected validate(props: RelationshipTypeProps): void {
    if (!ALL_RELATIONSHIP_VALUES.includes(props.value))
      throw new Error(`RelationshipType is invalid : ${props.value}`);
  }

  static from(value: string): RelationshipType {
    if (!ALL_RELATIONSHIP_VALUES.includes(value as RelationshipTypeValue))
      throw new Error(`RelationshipType is invalid : ${value}`);
    return new RelationshipType({ value: value as RelationshipTypeValue });
  }

  static all(): RelationshipType[] {
    return ALL_RELATIONSHIP_VALUES.map(
      (v) => new RelationshipType({ value: v }),
    );
  }

  static classTypes(): RelationshipType[] {
    return Array.from(CLASS_RELATIONSHIP_TYPES).map(
      (v) => new RelationshipType({ value: v }),
    );
  }

  get value(): RelationshipTypeValue {
    return this.props.value;
  }

  get label(): string {
    return RELATIONSHIP_META[this.props.value].label;
  }

  get labelFa(): string {
    return RELATIONSHIP_META[this.props.value].labelFa;
  }

  isClassType(): boolean {
    return CLASS_RELATIONSHIP_TYPES.has(this.props.value);
  }

  isGeneralization(): boolean {
    return this.props.value === "ClassGeneralization";
  }

  isAggregation(): boolean {
    return (
      this.props.value === "ClassAggregation" ||
      this.props.value === "ClassComposition"
    );
  }

  isRealization(): boolean {
    return this.props.value === "ClassRealization";
  }

  toString(): string {
    return this.props.value;
  }
}
