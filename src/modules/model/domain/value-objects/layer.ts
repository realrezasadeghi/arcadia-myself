import { ValueObject } from "@/modules/shared/domain/value-object";

export type LayerValue = "OA" | "SA" | "LA" | "PA";

interface LayerProps {
  value: LayerValue;
}

interface LayerMeta {
  labelFa: string;
  label: string;
  order: number;
}

const LAYER_META: Record<LayerValue, LayerMeta> = {
  OA: { labelFa: "تحلیل عملیاتی", label: "Operational Analysis", order: 1 },
  SA: { labelFa: "تحلیل سیستم", label: "System Analysis", order: 2 },
  LA: { labelFa: "معماری منطقی", label: "Logical Architecture", order: 3 },
  PA: { labelFa: "معماری فیزیکی", label: "Physical Architecture", order: 4 },
};

/**
 * Layer — Value Object
 *
 * نمایانگر یکی از لایه‌های چهارگانه Arcadia.
 * حاوی business behavior برای مقایسه و بررسی ترتیب لایه‌ها.
 */
export class Layer extends ValueObject<LayerProps> {
  static readonly OA = new Layer({ value: "OA" });
  static readonly SA = new Layer({ value: "SA" });
  static readonly LA = new Layer({ value: "LA" });
  static readonly PA = new Layer({ value: "PA" });

  private static readonly ALL: Layer[] = [
    Layer.OA,
    Layer.SA,
    Layer.LA,
    Layer.PA,
  ];

  protected validate(props: LayerProps): void {
    if (!["OA", "SA", "LA", "PA"].includes(props.value)) {
      throw new Error(`Invalid layer value : ${props.value}`);
    }
  }

  static from(value: string): Layer {
    const found = Layer.ALL.find((l) => l.value === value);
    if (!found) throw new Error(`Invalid layer value : ${value}`);
    return found;
  }

  static all(): Layer[] {
    return [...Layer.ALL];
  }

  get value(): LayerValue {
    return this.props.value;
  }
  get order(): number {
    return LAYER_META[this.props.value].order;
  }
  get labelFa(): string {
    return LAYER_META[this.props.value].labelFa;
  }
  get label(): string {
    return LAYER_META[this.props.value].label;
  }

  isHigherAbstractionThan(other: Layer): boolean {
    return this.order < other.order;
  }

  nextLayer(): Layer | null {
    return Layer.ALL.find((l) => l.order === this.order + 1) ?? null;
  }

  previousLayer(): Layer | null {
    return Layer.ALL.find((l) => l.order === this.order - 1) ?? null;
  }

  canBeRealizedBy(candidate: Layer): boolean {
    return candidate.order === this.order + 1;
  }

  toString(): string {
    return this.props.value;
  }
}
