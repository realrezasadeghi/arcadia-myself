import { ValueObject } from "@/modules/shared/domain/value-object";
import {
  getRelationshipDefinition,
  TRACE_VALUES,
  type TraceLinkTypeValue,
} from "../relationships/definitions";

export type { TraceLinkTypeValue };

interface TraceLinkTypeProps {
  value: string;
  legacy?: boolean;
}

/**
 * TraceLinkType — Value Object
 *
 * نوع یک ارتباط Trace بین لایه‌های مختلف Arcadia.
 * نام‌گذاری و عبارت‌های جهت‌دار از `domain/relationships/definitions.ts` می‌آید؛
 * اطلاعات بصری در UI constants هستند.
 *
 * مسیر نوشتن (`from`) سخت‌گیرانه است و فقط نوع‌های ثبت‌شده در `TRACE_VALUES`
 * را می‌پذیرد. مسیر خواندن (`reconstitute`) با داده‌های قدیمی کنار می‌آید تا
 * ردیف‌های قدیمی به‌جای پرتاب خطا، با برچسب خام نمایش داده شوند.
 */
export class TraceLinkType extends ValueObject<TraceLinkTypeProps> {
  static readonly Realization = new TraceLinkType({ value: "Realization" });
  static readonly Refinement = new TraceLinkType({ value: "Refinement" });

  protected validate(props: TraceLinkTypeProps): void {
    if (props.legacy) return;
    if (!TRACE_VALUES.includes(props.value as TraceLinkTypeValue))
      throw new Error(`TraceLinkType is invalid : ${props.value}`);
  }

  static from(value: string): TraceLinkType {
    return new TraceLinkType({ value });
  }

  static reconstitute(value: string): TraceLinkType {
    return TRACE_VALUES.includes(value as TraceLinkTypeValue)
      ? new TraceLinkType({ value })
      : new TraceLinkType({ value, legacy: true });
  }

  static all(): TraceLinkType[] {
    return TRACE_VALUES.map((value) => new TraceLinkType({ value }));
  }

  get value(): string {
    return this.props.value;
  }

  get isLegacy(): boolean {
    return this.props.legacy === true;
  }

  get label(): string {
    return (
      getRelationshipDefinition(this.props.value)?.label ?? this.props.value
    );
  }

  get labelFa(): string {
    return (
      getRelationshipDefinition(this.props.value)?.labelFa ?? this.props.value
    );
  }

  isCrossLayer(): boolean {
    return (
      this.props.value === "Realization" || this.props.value === "Refinement"
    );
  }

  toString(): string {
    return this.props.value;
  }
}
