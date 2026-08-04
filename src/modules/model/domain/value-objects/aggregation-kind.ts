import { ValueObject } from "@/modules/shared/domain/value-object";

export type AggregationKindValue = "NONE" | "SHARED" | "COMPOSITE";

interface AggregationKindProps {
  value: AggregationKindValue;
}

const ALL_KINDS: AggregationKindValue[] = ["NONE", "SHARED", "COMPOSITE"];

export class AggregationKind extends ValueObject<AggregationKindProps> {
  static readonly NONE = new AggregationKind({ value: "NONE" });
  static readonly SHARED = new AggregationKind({ value: "SHARED" });
  static readonly COMPOSITE = new AggregationKind({ value: "COMPOSITE" });

  private static readonly ALL: AggregationKind[] = [
    AggregationKind.NONE,
    AggregationKind.SHARED,
    AggregationKind.COMPOSITE,
  ];

  protected validate(props: AggregationKindProps): void {
    if (!ALL_KINDS.includes(props.value)) {
      throw new Error(`Invalid aggregation kind: ${props.value}`);
    }
  }

  static from(value: string): AggregationKind {
    const found = AggregationKind.ALL.find((k) => k.value === value);
    if (!found) throw new Error(`Invalid aggregation kind: ${value}`);
    return found;
  }

  static all(): AggregationKind[] {
    return [...AggregationKind.ALL];
  }

  get value(): AggregationKindValue {
    return this.props.value;
  }

  isComposite(): boolean {
    return this.props.value === "COMPOSITE";
  }

  isShared(): boolean {
    return this.props.value === "SHARED";
  }

  isNone(): boolean {
    return this.props.value === "NONE";
  }

  toString(): string {
    return this.props.value;
  }
}
