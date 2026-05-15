import { ValueObject } from "@/modules/shared/domain/value-object";
import type { RelationshipMeta } from "../types/relationship";

export type TraceLinkTypeValue =
  | "Realization"
  | "Allocation"
  | "Deployment"
  | "Involvement"
  | "Refinement";

interface TraceLinkTypeProps {
  value: TraceLinkTypeValue;
}

const TRACE_META: Record<TraceLinkTypeValue, RelationshipMeta> = {
  Realization: { label: "Realization", labelFa: "تحقق" },
  Allocation: { label: "Allocation", labelFa: "تخصیص" },
  Deployment: { label: "Deployment", labelFa: "استقرار" },
  Involvement: { label: "Involvement", labelFa: "مشارکت" },
  Refinement: { label: "Refinement", labelFa: "اصلاح" },
};

const ALL_TRACE_VALUES = Object.keys(TRACE_META) as TraceLinkTypeValue[];

/**
 * TraceLinkType — Value Object
 *
 * نوع یک ارتباط Trace بین لایه‌های مختلف Arcadia.
 * اطلاعات بصری در presentation/config/visual.config.ts هستند.
 */
export class TraceLinkType extends ValueObject<TraceLinkTypeProps> {
  static readonly Realization = new TraceLinkType({ value: "Realization" });
  static readonly Allocation = new TraceLinkType({ value: "Allocation" });
  static readonly Deployment = new TraceLinkType({ value: "Deployment" });
  static readonly Involvement = new TraceLinkType({ value: "Involvement" });
  static readonly Refinement = new TraceLinkType({ value: "Refinement" });

  protected validate(props: TraceLinkTypeProps): void {
    if (!ALL_TRACE_VALUES.includes(props.value))
      throw new Error(`TraceLinkType is invalid : ${props.value}`);
  }

  static from(value: string): TraceLinkType {
    if (!ALL_TRACE_VALUES.includes(value as TraceLinkTypeValue))
      throw new Error(`TraceLinkType is invalid : ${value}`);

    return new TraceLinkType({ value: value as TraceLinkTypeValue });
  }

  get value(): TraceLinkTypeValue {
    return this.props.value;
  }

  get label(): string {
    return TRACE_META[this.props.value].label;
  }

  get labelFa(): string {
    return TRACE_META[this.props.value].labelFa;
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
