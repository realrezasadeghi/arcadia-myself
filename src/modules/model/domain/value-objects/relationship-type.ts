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
  | "Composition";

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
};

const ALL_RELATIONSHIP_VALUES = Object.keys(
  RELATIONSHIP_META,
) as RelationshipTypeValue[];

interface RelationshipTypeProps {
  value: RelationshipTypeValue;
}

/**
 * RelationshipType — Value Object
 *
 * نوع یک ارتباط بین المنت‌ها در لایه‌های Arcadia.
 * اطلاعات بصری (رنگ خط، نوع فلش) در presentation/config/visual.config.ts هستند.
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

  get value(): RelationshipTypeValue {
    return this.props.value;
  }

  get label(): string {
    return RELATIONSHIP_META[this.props.value].label;
  }

  get labelFa(): string {
    return RELATIONSHIP_META[this.props.value].labelFa;
  }

  toString(): string {
    return this.props.value;
  }
}
