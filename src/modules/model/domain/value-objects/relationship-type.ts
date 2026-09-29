import { ValueObject } from "@/modules/shared/domain/value-object";
import {
  CONNECTION_VALUES,
  RELATIONSHIP_DEFINITIONS,
  type RelationshipTypeValue,
  type TraceLinkTypeValue,
} from "../relationships/definitions";

export type { RelationshipTypeValue, TraceLinkTypeValue };

interface RelationshipTypeProps {
  value: RelationshipTypeValue;
}

/**
 * RelationshipType — Value Object
 *
 * نوع یک ارتباط بین المنت‌ها در لایه‌های Arcadia.
 * نام‌گذاری و عبارت‌های جهت‌دار از `domain/relationships/definitions.ts` می‌آید؛
 * اطلاعات بصری (رنگ خط، نوع فلش) در UI constants هستند.
 */
export class RelationshipType extends ValueObject<RelationshipTypeProps> {
  protected validate(props: RelationshipTypeProps): void {
    if (!CONNECTION_VALUES.includes(props.value))
      throw new Error(`RelationshipType is invalid : ${props.value}`);
  }

  static from(value: string): RelationshipType {
    if (!CONNECTION_VALUES.includes(value as RelationshipTypeValue))
      throw new Error(`RelationshipType is invalid : ${value}`);
    return new RelationshipType({ value: value as RelationshipTypeValue });
  }

  static all(): RelationshipType[] {
    return CONNECTION_VALUES.map((value) => new RelationshipType({ value }));
  }

  get value(): RelationshipTypeValue {
    return this.props.value;
  }

  get label(): string {
    return RELATIONSHIP_DEFINITIONS[this.props.value].label;
  }

  get labelFa(): string {
    return RELATIONSHIP_DEFINITIONS[this.props.value].labelFa;
  }

  toString(): string {
    return this.props.value;
  }
}
